// ==========================================
// DIRECCIÓN DE NUESTRO BACKEND
// ==========================================

const API_URL = "http://127.0.0.1:5000/api/lotes";


// ==========================================
// VARIABLES
// ==========================================

let lotes = [];

let loteEditando = null;


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const formLote = document.getElementById("formLote");

const pais = document.getElementById("pais");
const region = document.getElementById("region");
const fundo = document.getElementById("fundo");
const lote = document.getElementById("lote");
const variedad = document.getElementById("variedad");
const fechaCosecha = document.getElementById("fechaCosecha");

const tablaLotesBody =
    document.getElementById("tablaLotesBody");

const buscarLote =
    document.getElementById("buscarLote");

const contadorLotes =
    document.getElementById("contadorLotes");

const ultimaCosecha =
    document.getElementById("ultimaCosecha");


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    const partes = fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// CARGAR LOTES DESDE PYTHON / SQLITE
// ==========================================

async function cargarLotes() {

    try {

        const respuesta =
            await fetch(API_URL);

        lotes =
            await respuesta.json();

        renderizarLotes();

    }

    catch (error) {

        console.error(
            "Error al cargar los lotes:",
            error
        );

    }
}


// ==========================================
// MOSTRAR LOTES
// ==========================================

function renderizarLotes(lista = lotes) {

    tablaLotesBody.innerHTML = "";

    lista.forEach((item) => {

        const fila =
            document.createElement("tr");
fila.innerHTML = `
    <td>${item.codigo}</td>
    <td><strong>${item.lote}</strong></td>
    <td>${item.pais}</td>
    <td>${item.region}</td>
    <td>${item.fundo}</td>
    <td>${item.variedad}</td>
    <td>${formatearFecha(item.fechaCosecha)}</td>

    <td>

        <button
            class="btn-tabla btn-ver"
            onclick="verLote(${item.id})"
        >
            👁 Ver
        </button>

        <button
            class="btn-tabla btn-editar"
            onclick="editarLote(${item.id})"
        >
            ✏️ Editar
        </button>

        <button
            class="btn-tabla btn-eliminar"
            onclick="eliminarLote(${item.id})"
        >
            🗑 Eliminar
        </button>

    </td>
`;


        tablaLotesBody.appendChild(fila);

    });

    actualizarResumen();
}


// ==========================================
// GUARDAR / EDITAR LOTE
// ==========================================

formLote.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        const datosLote = {

            pais: pais.value,

            region: region.value,

            fundo: fundo.value,

            lote: lote.value,

            variedad: variedad.value,

            fechaCosecha:
                fechaCosecha.value

        };


        try {

            // ==================================
            // EDITAR
            // ==================================

            if (loteEditando !== null) {

                await fetch(
                    `${API_URL}/${loteEditando}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datosLote)
                    }
                );

                alert(
                    "✅ Lote actualizado correctamente."
                );

                loteEditando = null;

            }


            // ==================================
            // NUEVO LOTE
            // ==================================

            else {

                // Código temporal
                const codigo =
                    "FRG-" +
                    String(
                        Date.now()
                    ).slice(-5);

                datosLote.codigo = codigo;


                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datosLote)
                    }
                );

                alert(
                    "✅ Nuevo lote registrado correctamente."
                );

            }


            formLote.reset();

            await cargarLotes();

        }

        catch (error) {

            console.error(
                "Error al guardar:",
                error
            );

            alert(
                "❌ No se pudo guardar el lote."
            );

        }

    }
);


// ==========================================
// ELIMINAR
// ==========================================

async function eliminarLote(id) {

    const confirmar =
        confirm(
            "¿Deseas eliminar este lote?"
        );

    if (!confirmar) {
        return;
    }


    try {

        await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        await cargarLotes();

    }

    catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );

    }
}


// ==========================================
// EDITAR
// ==========================================

function editarLote(id) {

    const item =
        lotes.find(
            lote => lote.id === id
        );


    if (!item) {
        return;
    }


    pais.value =
        item.pais;

    region.value =
        item.region;

    fundo.value =
        item.fundo;

    lote.value =
        item.lote;

    variedad.value =
        item.variedad;

    fechaCosecha.value =
        item.fechaCosecha;


    loteEditando = id;


    document
        .querySelector(
            ".formulario-lote"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// VER
// ==========================================

function verLote(id) {

    window.location.href =
        `detalle_lote.html?id=${id}`;

}

// ==========================================
// BUSCADOR
// ==========================================

buscarLote.addEventListener(
    "input",
    function() {

        const texto =
            this.value
                .toLowerCase()
                .trim();


        const resultados =
            lotes.filter(item =>

                item.codigo
                    .toLowerCase()
                    .includes(texto)

                ||

                item.pais
                    .toLowerCase()
                    .includes(texto)

                ||

                item.region
                    .toLowerCase()
                    .includes(texto)

                ||

                item.fundo
                    .toLowerCase()
                    .includes(texto)

                ||

                item.lote
                    .toLowerCase()
                    .includes(texto)

                ||

                item.variedad
                    .toLowerCase()
                    .includes(texto)

            );


        renderizarLotes(
            resultados
        );

    }
);


// ==========================================
// RESUMEN
// ==========================================

function actualizarResumen() {

    contadorLotes.textContent =
        lotes.length;


    if (lotes.length === 0) {

        ultimaCosecha.textContent =
            "--";

        return;

    }


    const fechas =
        lotes.map(item =>

            new Date(
                item.fechaCosecha +
                "T00:00:00"
            )

        );


    const fechaMayor =
        new Date(
            Math.max(...fechas)
        );


    ultimaCosecha.textContent =
        fechaMayor
            .toLocaleDateString(
                "es-PE",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

}


// ==========================================
// CARGAR AL ABRIR LA PÁGINA
// ==========================================

cargarLotes();