const API_URL = `${API_BASE_URL}/api/lotes`;


const lotePacking =
    document.getElementById("lotePacking");

const formPacking =
    document.getElementById("formPacking");

const resultadoPacking =
    document.getElementById("resultadoPacking");


const fechaRecepcion =
    document.getElementById("fechaRecepcion");

const fechaPacking =
    document.getElementById("fechaPacking");

const prefrioTemp =
    document.getElementById("prefrioTemp");

const tipoEmpaque =
    document.getElementById("tipoEmpaque");

const temperaturaCamara =
    document.getElementById("temperaturaCamara");

const o2 =
    document.getElementById("o2");

const co2 =
    document.getElementById("co2");

const observacionesPacking =
    document.getElementById("observacionesPacking");


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "--";
    }

    const partes =
        fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// CARGAR LOTES
// ==========================================

async function cargarLotes() {

    try {

        const respuesta =
            await fetch(API_URL);

        const lotes =
            await respuesta.json();


        lotes.forEach(item => {

            const opcion =
                document.createElement("option");

            opcion.value =
                item.id;

            opcion.textContent =
                `${item.codigo} - ${item.fundo} - ${item.variedad}`;

            lotePacking.appendChild(opcion);

        });

    }

    catch (error) {

        console.error(
            "Error al cargar lotes:",
            error
        );

    }

}


// ==========================================
// CONSULTAR PACKING
// ==========================================

async function consultarPacking() {

    const id =
        lotePacking.value;


    if (!id) {

        resultadoPacking.innerHTML = `

            <p class="mensaje-proximamente">

                Selecciona un lote para consultar
                su información.

            </p>

        `;

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}/packing`
            );


        if (!respuesta.ok) {

            resultadoPacking.innerHTML = `

                <p class="mensaje-proximamente">

                    Este lote todavía no tiene
                    información de packing registrada.

                </p>

            `;

            return;

        }


        const packing =
            await respuesta.json();


        resultadoPacking.innerHTML = `

            <div class="grid-packing">

                <div class="dato-packing">

                    <span>
                        Recepción
                    </span>

                    <strong>
                        ${formatearFecha(packing.fechaRecepcion)}
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Packing
                    </span>

                    <strong>
                        ${formatearFecha(packing.fechaPacking)}
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Pre-frío
                    </span>

                    <strong>
                        ${packing.prefrioTemp ?? "--"} °C
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Empaque
                    </span>

                    <strong>
                        ${packing.tipoEmpaque || "--"}
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Cámara
                    </span>

                    <strong>
                        ${packing.temperaturaCamara ?? "--"} °C
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        O₂
                    </span>

                    <strong>
                        ${packing.o2 ?? "--"} %
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        CO₂
                    </span>

                    <strong>
                        ${packing.co2 ?? "--"} %
                    </strong>

                </div>

            </div>


            <div class="observacion-calidad">

                <span>
                    Observaciones
                </span>

                <p>
                    ${packing.observaciones || "Sin observaciones"}
                </p>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "Error al consultar packing:",
            error
        );

    }

}


// ==========================================
// GUARDAR PACKING
// ==========================================

formPacking.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        const id =
            lotePacking.value;


        if (!id) {

            alert(
                "Selecciona un lote."
            );

            return;

        }


        const datos = {

            fechaRecepcion:
                fechaRecepcion.value,

            fechaPacking:
                fechaPacking.value,

            prefrioTemp:
                prefrioTemp.value
                    ? parseFloat(prefrioTemp.value)
                    : null,

            tipoEmpaque:
                tipoEmpaque.value,

            temperaturaCamara:
                temperaturaCamara.value
                    ? parseFloat(temperaturaCamara.value)
                    : null,

            o2:
                o2.value
                    ? parseFloat(o2.value)
                    : null,

            co2:
                co2.value
                    ? parseFloat(co2.value)
                    : null,

            observaciones:
                observacionesPacking.value

        };


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/${id}/packing`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datos)
                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo guardar."
                );

            }


            alert(
                "✅ Packing registrado correctamente."
            );


            await consultarPacking();

        }

        catch (error) {

            console.error(error);

            alert(
                "❌ No se pudo registrar packing."
            );

        }

    }
);


// ==========================================
// CAMBIO DE LOTE
// ==========================================

lotePacking.addEventListener(
    "change",
    consultarPacking
);


// ==========================================
// INICIAR
// ==========================================

cargarLotes();