from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import psycopg2

from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

BASE_DATOS = "frutigenix.db"
DATABASE_URL = os.environ.get("DATABASE_URL")

USANDO_POSTGRES = DATABASE_URL is not None

# ==========================================
# CONEXIÓN CON LA BASE DE DATOS
# ==========================================

def conectar_bd():

    if USANDO_POSTGRES:

        conexion = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor
        )

        return conexion

    else:

        conexion = sqlite3.connect(
            BASE_DATOS
        )

        conexion.row_factory = sqlite3.Row

        return conexion

def adaptar_sql(sql):

    if USANDO_POSTGRES:
        return sql.replace("?", "%s")

    return sql

def ejecutar(conexion, sql, parametros=()):

    cursor = conexion.cursor()

    cursor.execute(
        adaptar_sql(sql),
        parametros
    )

    return cursor
# ==========================================
# CREAR TABLA DE LOTES
# ==========================================
def crear_tabla():

    conexion = conectar_bd()
    cursor = conexion.cursor()

    if USANDO_POSTGRES:
        tipo_id = "SERIAL PRIMARY KEY"
    else:
        tipo_id = "INTEGER PRIMARY KEY AUTOINCREMENT"


    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS lotes (
            id {tipo_id},
            codigo TEXT NOT NULL,
            pais TEXT,
            region TEXT,
            exportadora TEXT,
            fundo TEXT,
            lote TEXT,
            variedad TEXT,
            fecha_cosecha TEXT
            
        )
    """)
    # Agregar columna exportadora a bases ya existentes
    if USANDO_POSTGRES:
        cursor.execute("""
            ALTER TABLE lotes
            ADD COLUMN IF NOT EXISTS exportadora TEXT
        """)
    else:
        cursor.execute("PRAGMA table_info(lotes)")
        columnas = [fila[1] for fila in cursor.fetchall()]

        if "exportadora" not in columnas:
            cursor.execute("""
                ALTER TABLE lotes
                ADD COLUMN exportadora TEXT
            """)


    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS calidad (
            id {tipo_id},
            lote_id INTEGER NOT NULL,
            calibre REAL,
            firmeza REAL,
            brix REAL,
            acidez REAL,
            defectos REAL,
            observaciones TEXT,
            FOREIGN KEY (lote_id)
            REFERENCES lotes(id)
        )
    """)


    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS packing (
            id {tipo_id},
            lote_id INTEGER NOT NULL,
            fecha_recepcion TEXT,
            fecha_packing TEXT,
            prefrio_temp REAL,
            tipo_empaque TEXT,
            temperatura_camara REAL,
            o2 REAL,
            co2 REAL,
            observaciones TEXT,
            FOREIGN KEY (lote_id)
            REFERENCES lotes(id)
        )
    """)


    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS recorrido (
            id {tipo_id},
            lote_id INTEGER NOT NULL,
            fecha_despacho TEXT,
            transportista TEXT,
            puerto_salida TEXT,
            pais_destino TEXT,
            ciudad_destino TEXT,
            estado_envio TEXT,
            fecha_llegada_estimada TEXT,
            observaciones TEXT,
            FOREIGN KEY (lote_id)
            REFERENCES lotes(id)
        )
    """)


    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS documentos (
            id {tipo_id},
            lote_id INTEGER NOT NULL,
            tipo_documento TEXT,
            nombre_documento TEXT NOT NULL,
            numero_documento TEXT,
            fecha_emision TEXT,
            entidad_emisora TEXT,
            url_documento TEXT,
            observaciones TEXT,
            FOREIGN KEY (lote_id)
            REFERENCES lotes(id)
        )
    """)


    conexion.commit()
    conexion.close()



# ==========================================
# RUTAS DE PRUEBA
# ==========================================

@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "Servidor NECHDATA funcionando 🫐"
    })


# ==========================================
# OBTENER TODOS LOS LOTES / Si alguien pide el lote n° 1 lo busca en la base de datos y lo devuelve.
# ==========================================

@app.route("/api/lotes", methods=["GET"])
def obtener_lotes():

    conexion = conectar_bd()

    lotes = ejecutar(
        conexion,
        """
        SELECT
    id,
    codigo,
    pais,
    region,
    exportadora,
    fundo,
    lote,
    variedad,
    fecha_cosecha
FROM lotes
        ORDER BY id DESC
        """
    ).fetchall()

    conexion.close()

    resultado = []

    for lote in lotes:

        resultado.append({
            "id": lote["id"],
            "codigo": lote["codigo"],
            "pais": lote["pais"],
            "region": lote["region"],
            "exportadora": lote["exportadora"],
            "fundo": lote["fundo"],
            "lote": lote["lote"],
            "variedad": lote["variedad"],
            "fechaCosecha": lote["fecha_cosecha"]
        })

    return jsonify(resultado)

# ==========================================
# REGISTRAR NUEVO LOTE
# ==========================================

@app.route("/api/lotes", methods=["POST"])
def registrar_lote():

    datos = request.get_json()
    exportadora = datos.get("exportadora")

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        INSERT INTO lotes (
    codigo,
    pais,
    region,
    exportadora,
    fundo,
    lote,
    variedad,
    fecha_cosecha
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            datos["codigo"],
            datos["pais"],
            datos["region"],
            datos["exportadora"],
            datos["fundo"],
            datos["lote"],
            datos["variedad"],
            datos["fechaCosecha"]
        )
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Lote registrado correctamente"
    }), 201

# ==========================================
# ELIMINAR LOTE
# ==========================================

@app.route("/api/lotes/<int:id>", methods=["DELETE"])
def eliminar_lote(id):

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        DELETE FROM lotes
        WHERE id = ?
        """,
        (id,)
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Lote eliminado correctamente"
    })

# ==========================================
# EDITAR LOTE
# ==========================================

@app.route("/api/lotes/<int:id>", methods=["PUT"])
def editar_lote(id):
    datos = request.get_json()
    exportadora = datos.get("exportadora")

    conexion = conectar_bd()

    ejecutar(
    conexion,
    """
    UPDATE lotes
    SET pais = ?,
        region = ?,
        exportadora = ?,
        fundo = ?,
        lote = ?,
        variedad = ?,
        fecha_cosecha = ?
    WHERE id = ?
    """,
    (
        datos["pais"],
        datos["region"],
        datos["exportadora"],
        datos["fundo"],
        datos["lote"],
        datos["variedad"],
        datos["fechaCosecha"],
        id
    )
)

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Lote actualizado correctamente"
    })

# ==========================================
# OBTENER UN SOLO LOTE
# ==========================================

@app.route("/api/lotes/<int:id>", methods=["GET"])
def obtener_lote(id):

    conexion = conectar_bd()

    lote = ejecutar(
        conexion,
        """
        SELECT
    id,
    codigo,
    pais,
    region,
    exportadora,
    fundo,
    lote,
    variedad,
    fecha_cosecha
FROM lotes
WHERE id = ?
""",
        (id,)
    ).fetchone()

    conexion.close()

    if lote is None:
        return jsonify({
            "mensaje": "Lote no encontrado"
        }), 404

    return jsonify({
        "id": lote["id"],
        "codigo": lote["codigo"],
        "pais": lote["pais"],
        "region": lote["region"],
        "exportadora": lote["exportadora"],
        "fundo": lote["fundo"],
        "lote": lote["lote"],
        "variedad": lote["variedad"],
        "fechaCosecha": lote["fecha_cosecha"]
    })

# ==========================================
# INICIAR SERVIDOR
# ==========================================
# ==========================================
# OBTENER CALIDAD DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/calidad", methods=["GET"])
def obtener_calidad(lote_id):

    conexion = conectar_bd()

    calidad = ejecutar(
        conexion,
        """
        SELECT *
        FROM calidad
        WHERE lote_id = ?
        ORDER BY id DESC
        LIMIT 1
        """,
        (lote_id,)
    ).fetchone()

    conexion.close()

    if calidad is None:
        return jsonify({
            "mensaje": "No hay información de calidad registrada"
        }), 404

    return jsonify({
        "id": calidad["id"],
        "lote_id": calidad["lote_id"],
        "calibre": calidad["calibre"],
        "firmeza": calidad["firmeza"],
        "brix": calidad["brix"],
        "acidez": calidad["acidez"],
        "defectos": calidad["defectos"],
        "observaciones": calidad["observaciones"]
    })


# ==========================================
# REGISTRAR CALIDAD DE UN LOTE
# ==========================================

# ==========================================
# REGISTRAR CALIDAD DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/calidad", methods=["POST"])
def registrar_calidad(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        INSERT INTO calidad (
            lote_id,
            calibre,
            firmeza,
            brix,
            acidez,
            defectos,
            observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            lote_id,
            datos.get("calibre"),
            datos.get("firmeza"),
            datos.get("brix"),
            datos.get("acidez"),
            datos.get("defectos"),
            datos.get("observaciones")
        )
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje":
            "Información de calidad registrada correctamente"
    }), 201
# ==========================================
# RUTAS DE PACKING
# ==========================================

@app.route("/api/lotes/<int:lote_id>/packing", methods=["GET"])
def obtener_packing(lote_id):

    conexion = conectar_bd()

    packing = ejecutar(
        conexion,
        """
        SELECT *
        FROM packing
        WHERE lote_id = ?
        ORDER BY id DESC
        LIMIT 1
        """,
        (lote_id,)
    ).fetchone()

    conexion.close()

    if packing is None:
        return jsonify({
            "mensaje": "No hay información de packing registrada"
        }), 404

    return jsonify({
        "id": packing["id"],
        "lote_id": packing["lote_id"],
        "fechaRecepcion": packing["fecha_recepcion"],
        "fechaPacking": packing["fecha_packing"],
        "prefrioTemp": packing["prefrio_temp"],
        "tipoEmpaque": packing["tipo_empaque"],
        "temperaturaCamara": packing["temperatura_camara"],
        "o2": packing["o2"],
        "co2": packing["co2"],
        "observaciones": packing["observaciones"]
    })


# ==========================================
# REGISTRAR PACKING DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/packing", methods=["POST"])
def registrar_packing(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        INSERT INTO packing (
            lote_id,
            fecha_recepcion,
            fecha_packing,
            prefrio_temp,
            tipo_empaque,
            temperatura_camara,
            o2,
            co2,
            observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            lote_id,
            datos.get("fechaRecepcion"),
            datos.get("fechaPacking"),
            datos.get("prefrioTemp"),
            datos.get("tipoEmpaque"),
            datos.get("temperaturaCamara"),
            datos.get("o2"),
            datos.get("co2"),
            datos.get("observaciones")
        )
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Información de packing registrada correctamente"
    }), 201
# ==========================================
# OBTENER RECORRIDO DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/recorrido", methods=["GET"])
def obtener_recorrido(lote_id):

    conexion = conectar_bd()

    recorrido = ejecutar(
        conexion,
        """
        SELECT *
        FROM recorrido
        WHERE lote_id = ?
        ORDER BY id DESC
        LIMIT 1
        """,
        (lote_id,)
    ).fetchone()

    conexion.close()

    if recorrido is None:
        return jsonify({
            "mensaje": "No hay información de recorrido registrada"
        }), 404

    return jsonify({
        "id": recorrido["id"],
        "lote_id": recorrido["lote_id"],
        "fechaDespacho": recorrido["fecha_despacho"],
        "transportista": recorrido["transportista"],
        "puertoSalida": recorrido["puerto_salida"],
        "paisDestino": recorrido["pais_destino"],
        "ciudadDestino": recorrido["ciudad_destino"],
        "estadoEnvio": recorrido["estado_envio"],
        "fechaLlegadaEstimada": recorrido["fecha_llegada_estimada"],
        "observaciones": recorrido["observaciones"]
    })

# ==========================================
# RUTAS DE RECORRIDO
# ==========================================

@app.route("/api/lotes/<int:lote_id>/recorrido", methods=["POST"])
def registrar_recorrido(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        INSERT INTO recorrido (
            lote_id,
            fecha_despacho,
            transportista,
            puerto_salida,
            pais_destino,
            ciudad_destino,
            estado_envio,
            fecha_llegada_estimada,
            observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            lote_id,
            datos.get("fechaDespacho"),
            datos.get("transportista"),
            datos.get("puertoSalida"),
            datos.get("paisDestino"),
            datos.get("ciudadDestino"),
            datos.get("estadoEnvio"),
            datos.get("fechaLlegadaEstimada"),
            datos.get("observaciones")
        )
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Recorrido registrado correctamente"
    }), 201
# ==========================================
# OBTENER DOCUMENTOS DE UN LOTE
# ==========================================

@app.route(
    "/api/lotes/<int:lote_id>/documentos",
    methods=["GET"]
)
def obtener_documentos(lote_id):

    conexion = conectar_bd()

    documentos = ejecutar(
        conexion,
        """
        SELECT *
        FROM documentos
        WHERE lote_id = ?
        ORDER BY id DESC
        """,
        (lote_id,)
    ).fetchall()

    conexion.close()

    return jsonify([
        {
            "id": documento["id"],
            "lote_id": documento["lote_id"],
            "tipoDocumento": documento["tipo_documento"],
            "nombreDocumento": documento["nombre_documento"],
            "numeroDocumento": documento["numero_documento"],
            "fechaEmision": documento["fecha_emision"],
            "entidadEmisora": documento["entidad_emisora"],
            "urlDocumento": documento["url_documento"],
            "observaciones": documento["observaciones"]
        }
        for documento in documentos
    ])

# ==========================================
# REGISTRAR DOCUMENTO
# ==========================================

@app.route(
    "/api/lotes/<int:lote_id>/documentos",
    methods=["POST"]
)
def registrar_documento(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()

    ejecutar(
        conexion,
        """
        INSERT INTO documentos (
            lote_id,
            tipo_documento,
            nombre_documento,
            numero_documento,
            fecha_emision,
            entidad_emisora,
            url_documento,
            observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            lote_id,
            datos.get("tipoDocumento"),
            datos.get("nombreDocumento"),
            datos.get("numeroDocumento"),
            datos.get("fechaEmision"),
            datos.get("entidadEmisora"),
            datos.get("urlDocumento"),
            datos.get("observaciones")
        )
    )

    conexion.commit()
    conexion.close()

    return jsonify({
        "mensaje": "Documento registrado correctamente"
    }), 201

# ==========================================
# CREAR TABLAS AL INICIAR
# ==========================================

crear_tabla()


# ==========================================
# INICIAR SERVIDOR LOCAL
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)