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

if __name__ == "__main__":
    crear_tabla()
    app.run(debug=True)