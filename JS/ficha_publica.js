console.log("✅ ficha_publica.js está funcionando");

const API_URL =
    "http://127.0.0.1:5000/api/lotes";


const parametros =
    new URLSearchParams(
        window.location.search
    );

const idLote =
    parametros.get("id");


const pantallaCarga =
    document.getElementById(
        "pantallaCarga"
    );

const contenidoFicha =
    document.getElementById(
        "contenidoFicha"
    );


function formatearFecha(fecha) {

    if (!fecha) {
        return "--";
    }

    const partes =
        fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// CARGAR LOTE
// ==========================================

async function cargarFichaPublica() {

    if (!idLote) {

        document.getElementById(
            "codigoPublico"
        ).textContent =
            "Lote no identificado";

        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}`
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se encontró el lote."
            );

        }

        const lote =
            await respuesta.json();

        console.log("LOTE RECIBIDO:", lote);


        document.getElementById(
            "variedadCarga"
        ).textContent =
            lote.variedad;


        document.getElementById(
            "codigoPublico"
        ).textContent =
            lote.codigo;


        document.getElementById(
            "variedadPublica"
        ).textContent =
            lote.variedad;


document.getElementById(
    "origenPublico"
).textContent =
    "Fundo Salvador · Santiago, Ica, Perú";


        document.getElementById(
            "paisPublico"
        ).textContent =
            lote.pais;


        document.getElementById(
            "regionPublico"
        ).textContent =
            lote.region;


        document.getElementById(
            "fundoPublico"
        ).textContent =
            lote.fundo;


        document.getElementById(
            "lotePublico"
        ).textContent =
            lote.lote;


        document.getElementById(
            "fechaPublica"
        ).textContent =
            formatearFecha(
                lote.fechaCosecha
            );


document.getElementById(
    "rutaOrigen"
).textContent =
    "Fundo Salvador · Santiago, Ica, Perú";


        await cargarCalidadPublica();
        await cargarPackingPublico();


        setTimeout(() => {

            pantallaCarga.classList.add(
                "oculto"
            );

            contenidoFicha.classList.remove(
                "oculto"
            );

        }, 1500);

    }

catch (error) {

    console.error(
        "Error al cargar ficha pública:",
        error
    );

    document.getElementById(
        "variedadCarga"
    ).textContent =
        "Error al cargar el lote";

    document.querySelector(
        ".pantalla-carga-nfc p"
    ).textContent =
        "No fue posible cargar la trazabilidad.";

}

}


// ==========================================
// CALIDAD
// ==========================================

async function cargarCalidadPublica() {

    const contenedor =
        document.getElementById(
            "calidadPublica"
        );


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/calidad`
            );


        if (!respuesta.ok) {

            contenedor.innerHTML = `
                <p class="mensaje-proximamente">
                    Sin información pública de calidad.
                </p>
            `;

            return;
        }


        const calidad =
            await respuesta.json();


        contenedor.innerHTML = `

            <div class="grid-ficha-publica">

                <div class="dato-publico">

                    <span>
                        Calibre
                    </span>

                    <strong>
                        ${calidad.calibre ?? "--"} mm
                    </strong>

                </div>


                <div class="dato-publico">

                    <span>
                        °Brix
                    </span>

                    <strong>
                        ${calidad.brix ?? "--"}
                    </strong>

                </div>


                <div class="dato-publico">

                    <span>
                        Firmeza
                    </span>

                    <strong>
                        ${calidad.firmeza ?? "--"}
                    </strong>

                </div>


                <div class="dato-publico">

                    <span>
                        Defectos
                    </span>

                    <strong>
                        ${calidad.defectos ?? "--"} %
                    </strong>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(
            error
        );

    }

}


// ==========================================
// PACKING
// ==========================================

async function cargarPackingPublico() {

    const contenedor =
        document.getElementById(
            "packingPublico"
        );


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/packing`
            );


        if (!respuesta.ok) {

            contenedor.innerHTML = `
                <p class="mensaje-proximamente">
                    Sin información pública de packing.
                </p>
            `;

            return;
        }


        const packing =
            await respuesta.json();


        contenedor.innerHTML = `

            <div class="grid-ficha-publica">

                <div class="dato-publico">

                    <span>
                        Fecha packing
                    </span>

                    <strong>
                        ${formatearFecha(
                            packing.fechaPacking
                        )}
                    </strong>

                </div>


                <div class="dato-publico">

                    <span>
                        Empaque
                    </span>

                    <strong>
                        ${packing.tipoEmpaque || "--"}
                    </strong>

                </div>


                <div class="dato-publico">

                    <span>
                        Cámara
                    </span>

                    <strong>
                        ${packing.temperaturaCamara ?? "--"} °C
                    </strong>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(
            error
        );

    }

}


cargarFichaPublica();