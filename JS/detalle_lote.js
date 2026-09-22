// ==========================================
// API
// ==========================================

const API_URL = `${API_BASE_URL}/api/lotes`;


// ==========================================
// OBTENER EL ID DESDE LA URL
// ==========================================

const parametros =
    new URLSearchParams(window.location.search);

const idLote =
    parametros.get("id");


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const codigoLote =
    document.getElementById("codigoLote");

const descripcionLote =
    document.getElementById("descripcionLote");

const paisLote =
    document.getElementById("paisLote");

const regionLote =
    document.getElementById("regionLote");

const fundoLote =
    document.getElementById("fundoLote");

const nombreLote =
    document.getElementById("nombreLote");

const variedadLote =
    document.getElementById("variedadLote");

const fechaLote =
    document.getElementById("fechaLote");


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
// CARGAR DATOS GENERALES DEL LOTE
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

const respuesta = await fetch(`${API_URL}/${idLote}`);


        if (!respuesta.ok) {

            throw new Error(
                "No se encontró el lote."
            );

        }


        const lote =
            await respuesta.json();


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

        console.error(
            "Error al cargar lote:",
            error
        );


        codigoLote.textContent =
            "Error al cargar lote";


        descripcionLote.textContent =
            "No fue posible obtener la información.";

    }

}


// ==========================================
// CARGAR CALIDAD DEL LOTE
// ==========================================

async function cargarCalidadLote() {

    const detalleCalidad =
        document.getElementById(
            "detalleCalidad"
        );


    if (!idLote) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/calidad`
            );


        if (!respuesta.ok) {

            detalleCalidad.innerHTML = `

                <p class="mensaje-proximamente">

                    Este lote todavía no tiene
                    información de calidad registrada.

                </p>

            `;

            return;

        }


        const calidad =
            await respuesta.json();


        detalleCalidad.innerHTML = `

            <div class="grid-calidad">

                <div class="dato-calidad">

                    <span>
                        Calibre
                    </span>

                    <strong>
                        ${calidad.calibre ?? "--"} mm
                    </strong>

                </div>


                <div class="dato-calidad">

                    <span>
                        Firmeza
                    </span>

                    <strong>
                        ${calidad.firmeza ?? "--"}
                    </strong>

                </div>


                <div class="dato-calidad">

                    <span>
                        °Brix
                    </span>

                    <strong>
                        ${calidad.brix ?? "--"}
                    </strong>

                </div>


                <div class="dato-calidad">

                    <span>
                        Acidez
                    </span>

                    <strong>
                        ${calidad.acidez ?? "--"}
                    </strong>

                </div>


                <div class="dato-calidad">

                    <span>
                        Defectos
                    </span>

                    <strong>
                        ${calidad.defectos ?? "--"} %
                    </strong>

                </div>

            </div>


            <div class="observacion-calidad">

                <span>
                    Observaciones
                </span>

                <p>
                    ${calidad.observaciones || "Sin observaciones"}
                </p>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "Error al cargar calidad:",
            error
        );


        detalleCalidad.innerHTML = `

            <p class="mensaje-proximamente">

                No fue posible obtener
                la información de calidad.

            </p>

        `;

    }

}


// ==========================================
// EJECUTAR AL ABRIR LA PÁGINA
// ==========================================
// ==========================================
// CARGAR PACKING DEL LOTE
// ==========================================

async function cargarPackingLote() {

    const detallePacking =
        document.getElementById(
            "detallePacking"
        );


    if (!idLote) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/packing`
            );


        if (!respuesta.ok) {

            detallePacking.innerHTML = `

                <p class="mensaje-proximamente">

                    Este lote todavía no tiene
                    información de packing registrada.

                </p>

            `;

            return;

        }


        const packing =
            await respuesta.json();


        detallePacking.innerHTML = `

            <div class="grid-packing">

                <div class="dato-packing">

                    <span>
                        Recepción
                    </span>

                    <strong>
                        ${formatearFecha(
                            packing.fechaRecepcion
                        )}
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Fecha de packing
                    </span>

                    <strong>
                        ${formatearFecha(
                            packing.fechaPacking
                        )}
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
                        Tipo de empaque
                    </span>

                    <strong>
                        ${packing.tipoEmpaque || "--"}
                    </strong>

                </div>


                <div class="dato-packing">

                    <span>
                        Temperatura de cámara
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
            "Error al cargar packing:",
            error
        );


        detallePacking.innerHTML = `

            <p class="mensaje-proximamente">

                No fue posible obtener
                la información de packing.

            </p>

        `;

    }

}
cargarDetalleLote();
cargarCalidadLote();
cargarPackingLote();