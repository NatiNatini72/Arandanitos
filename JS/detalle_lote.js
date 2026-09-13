// ==========================================
// API
// ==========================================

const API_URL = "http://127.0.0.1:5000/api/lotes";


// ==========================================
// OBTENER EL ID DESDE LA URL
// ==========================================

const parametros = new URLSearchParams(window.location.search);

const idLote = parametros.get("id");


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const codigoLote = document.getElementById("codigoLote");
const descripcionLote = document.getElementById("descripcionLote");

const paisLote = document.getElementById("paisLote");
const regionLote = document.getElementById("regionLote");
const fundoLote = document.getElementById("fundoLote");
const nombreLote = document.getElementById("nombreLote");
const variedadLote = document.getElementById("variedadLote");
const fechaLote = document.getElementById("fechaLote");


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "--";
    }

    const partes = fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// CARGAR UN LOTE
// ==========================================

async function cargarDetalleLote() {

    if (!idLote) {

        codigoLote.textContent =
            "Lote no identificado";

        descripcionLote.textContent =
            "No se recibió un ID de lote.";

        return;
    }


    try {

        const respuesta =
            await fetch(`${API_URL}/${idLote}`);


        if (!respuesta.ok) {

            throw new Error(
                "No se encontró el lote."
            );

        }


        const lote =
            await respuesta.json();


        // ==================================
        // MOSTRAR DATOS
        // ==================================

        codigoLote.textContent =
            lote.codigo;

        descripcionLote.textContent =
            `${lote.variedad} · ${lote.fundo}`;


        paisLote.textContent =
            lote.pais;

        regionLote.textContent =
            lote.region;

        fundoLote.textContent =
            lote.fundo;

        nombreLote.textContent =
            lote.lote;

        variedadLote.textContent =
            lote.variedad;

        fechaLote.textContent =
            formatearFecha(
                lote.fechaCosecha
            );

    }

    catch (error) {

        console.error(error);


        codigoLote.textContent =
            "Error al cargar lote";

        descripcionLote.textContent =
            "No fue posible obtener la información.";

    }

}


// ==========================================
// EJECUTAR AL ABRIR LA PÁGINA
// ==========================================

cargarDetalleLote();