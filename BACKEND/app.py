from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

BASE_DATOS = "frutigenix.db"


# ==========================================
# CONEXIÓN CON LA BASE DE DATOS
# ==========================================

def conectar_bd():
    conexion = sqlite3.connect(BASE_DATOS)
    conexion.row_factory = sqlite3.Row
    return conexion


# ==========================================
# CREAR TABLA DE LOTES
# ==========================================

def crear_tabla():
    conexion = conectar_bd()

    conexion.execute("""
        CREATE TABLE IF NOT EXISTS lotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE,
            pais TEXT NOT NULL,
            region TEXT NOT NULL,
            fundo TEXT NOT NULL,
            lote TEXT NOT NULL,
            variedad TEXT NOT NULL,
            fecha_cosecha TEXT NOT NULL
        )
    """)
    # ==========================================
    # TABLA DE CALIDAD
    # ==========================================

    conexion.execute("""
        CREATE TABLE IF NOT EXISTS calidad (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

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
        # ==========================================
    # TABLA DE PACKING Y POSCOSECHA
    # ==========================================

    conexion.execute("""
        CREATE TABLE IF NOT EXISTS packing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

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
    conexion.commit()
    conexion.close()


# ==========================================
# RUTA DE PRUEBA
# ==========================================

@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "Servidor FRUTIGENIX funcionando 🫐"
    })


# ==========================================
# OBTENER TODOS LOS LOTES / Si alguien pide el lote n° 1 lo busca en la base de datos y lo devuelve.
# ==========================================

@app.route("/api/lotes", methods=["GET"])
def obtener_lotes():
    conexion = conectar_bd()

    lotes = conexion.execute("""
        SELECT *
        FROM lotes
        ORDER BY id DESC
    """).fetchall()

    conexion.close()

    resultado = []

    for lote in lotes:
        resultado.append({
            "id": lote["id"],
            "codigo": lote["codigo"],
            "pais": lote["pais"],
            "region": lote["region"],
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

    conexion = conectar_bd()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO lotes (
            codigo,
            pais,
            region,
            fundo,
            lote,
            variedad,
            fecha_cosecha
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        datos["codigo"],
        datos["pais"],
        datos["region"],
        datos["fundo"],
        datos["lote"],
        datos["variedad"],
        datos["fechaCosecha"]
    ))

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

    conexion.execute("""
        DELETE FROM lotes
        WHERE id = ?
    """, (id,))

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

    conexion = conectar_bd()

    conexion.execute("""
        UPDATE lotes
        SET pais = ?,
            region = ?,
            fundo = ?,
            lote = ?,
            variedad = ?,
            fecha_cosecha = ?
        WHERE id = ?
    """, (
        datos["pais"],
        datos["region"],
        datos["fundo"],
        datos["lote"],
        datos["variedad"],
        datos["fechaCosecha"],
        id
    ))

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

    lote = conexion.execute("""
        SELECT *
        FROM lotes
        WHERE id = ?
    """, (id,)).fetchone()

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

    calidad = conexion.execute("""
        SELECT *
        FROM calidad
        WHERE lote_id = ?
        ORDER BY id DESC
        LIMIT 1
    """, (lote_id,)).fetchone()

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

        "observaciones":
            calidad["observaciones"]

    })


# ==========================================
# REGISTRAR CALIDAD DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/calidad", methods=["POST"])
def registrar_calidad(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()


    conexion.execute("""
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

    """, (

        lote_id,

        datos.get("calibre"),

        datos.get("firmeza"),

        datos.get("brix"),

        datos.get("acidez"),

        datos.get("defectos"),

        datos.get("observaciones")

    ))


    conexion.commit()

    conexion.close()


    return jsonify({
        "mensaje":
            "Información de calidad registrada correctamente"
    }), 201
# ==========================================
# OBTENER PACKING DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/packing", methods=["GET"])
def obtener_packing(lote_id):

    conexion = conectar_bd()

    packing = conexion.execute("""
        SELECT *
        FROM packing
        WHERE lote_id = ?
        ORDER BY id DESC
        LIMIT 1
    """, (lote_id,)).fetchone()

    conexion.close()


    if packing is None:

        return jsonify({
            "mensaje":
                "No hay información de packing registrada"
        }), 404


    return jsonify({

        "id": packing["id"],

        "lote_id": packing["lote_id"],

        "fechaRecepcion":
            packing["fecha_recepcion"],

        "fechaPacking":
            packing["fecha_packing"],

        "prefrioTemp":
            packing["prefrio_temp"],

        "tipoEmpaque":
            packing["tipo_empaque"],

        "temperaturaCamara":
            packing["temperatura_camara"],

        "o2":
            packing["o2"],

        "co2":
            packing["co2"],

        "observaciones":
            packing["observaciones"]

    })


# ==========================================
# REGISTRAR PACKING DE UN LOTE
# ==========================================

@app.route("/api/lotes/<int:lote_id>/packing", methods=["POST"])
def registrar_packing(lote_id):

    datos = request.get_json()

    conexion = conectar_bd()


    conexion.execute("""
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

    """, (

        lote_id,

        datos.get("fechaRecepcion"),

        datos.get("fechaPacking"),

        datos.get("prefrioTemp"),

        datos.get("tipoEmpaque"),

        datos.get("temperaturaCamara"),

        datos.get("o2"),

        datos.get("co2"),

        datos.get("observaciones")

    ))


    conexion.commit()
    conexion.close()


    return jsonify({
        "mensaje":
            "Información de packing registrada correctamente"
    }), 201
if __name__ == "__main__":
    crear_tabla()
    app.run(debug=True)