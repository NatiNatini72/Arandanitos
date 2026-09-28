console.log("✅ ficha_publica.js está funcionando");


// ==========================================
// CONFIGURACIÓN
// ==========================================

const API_URL =
    `${API_BASE_URL}/api/lotes`;

const parametros =
    new URLSearchParams(
        window.location.search
    );

const idLote =
    parametros.get("id");

console.log(
    "ID LOTE DESDE URL:",
    idLote
);


// ==========================================
// UTILIDADES
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "--";
    }

    const partes =
        fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function ponerTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent =
            valor ?? "--";
    }

}


function ponerHTML(id, contenido) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.innerHTML =
            contenido;
    }

}


// ==========================================
// CARGAR DATOS GENERALES DEL LOTE
// ==========================================

async function cargarFichaPublica() {

    if (!idLote) {

        console.error(
            "No se recibió un ID de lote."
        );

        return;
    }


    try {

        console.log(
            "Consultando:",
            `${API_URL}/${idLote}`
        );


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


        console.log(
            "LOTE RECIBIDO:",
            lote
        );


        // ==========================================
        // 01. PORTADA
        // ==========================================

        ponerTexto(
            "codigoPublicoPortada",
            lote.codigo
        );


        ponerTexto(
            "variedadPublica",
            lote.variedad
        );


        ponerTexto(
            "codigoPublico",
            `LOTE: ${lote.lote || "--"}`
        );


        ponerTexto(
            "fundoPublico",
            lote.fundo
        );


        ponerTexto(
            "origenPublico",
            `${lote.region || "--"}, ${lote.pais || "--"}`
        );


        // ==========================================
        // 02. ORIGEN
        // ==========================================

        ponerTexto(
            "regionTituloOrigen",
            lote.region
        );


        ponerTexto(
            "ubicacionFotoOrigen",
            `📍 ${lote.fundo || "Fundo"} · ${lote.region || "--"}, ${lote.pais || "--"}`
        );


        ponerTexto(
            "paisPublico",
            lote.pais
        );


        ponerTexto(
            "regionPublico",
            lote.region
        );


        ponerTexto(
            "productorDetallePublico",
            lote.fundo
        );


        ponerTexto(
            "exportadoraPublica",
            lote.exportadora
        );


        ponerTexto(
            "lotePublico",
            lote.lote
        );


        ponerTexto(
            "fechaPublica",
            formatearFecha(
                lote.fechaCosecha
            )
        );


        ponerTexto(
            "productorMapa",
            lote.fundo
        );


        ponerTexto(
            "ubicacionMapa",
            `Chincha, ${lote.region || "--"}, ${lote.pais || "--"}`
        );


        // ==========================================
        // 05. RECORRIDO - ORIGEN
        // ==========================================

        ponerTexto(
            "rutaOrigen",
            `${lote.fundo || "--"} · ${lote.region || "--"}, ${lote.pais || "--"}`
        );


        // ==========================================
        // CARGAR DEMÁS SECCIONES
        // ==========================================

        await cargarCalidadPublica();
        await cargarPackingPublico();
        await cargarRecorridoPublico();

    }


    catch (error) {

        console.error(
            "❌ Error al cargar ficha pública:",
            error
        );

    }

}


// ==========================================
// 03. CALIDAD
// ==========================================

async function cargarCalidadPublica() {

    const contenedor =
        document.getElementById(
            "calidadPublica"
        );


    if (!contenedor) {
        return;
    }


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
                    <span>Calibre</span>

                    <strong>
                        ${calidad.calibre ?? "--"} mm
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>°Brix</span>

                    <strong>
                        ${calidad.brix ?? "--"}
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>Firmeza</span>

                    <strong>
                        ${calidad.firmeza ?? "--"}
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>Acidez</span>

                    <strong>
                        ${calidad.acidez ?? "--"}
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>Defectos</span>

                    <strong>
                        ${calidad.defectos ?? "--"} %
                    </strong>
                </div>

            </div>
        `;

    }


    catch (error) {

        console.error(
            "❌ Error al cargar calidad:",
            error
        );

    }

}


// ==========================================
// 04. PACKING
// ==========================================

async function cargarPackingPublico() {

    const contenedor =
        document.getElementById(
            "packingPublico"
        );


    if (!contenedor) {
        return;
    }


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
                        Fecha de recepción
                    </span>

                    <strong>
                        ${formatearFecha(
                            packing.fechaRecepcion
                        )}
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>
                        Fecha de packing
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
                        Temperatura de pre-frío
                    </span>

                    <strong>
                        ${packing.prefrioTemp ?? "--"} °C
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>
                        Temperatura de almacenamiento
                    </span>

                    <strong>
                        ${packing.temperaturaCamara ?? "--"} °C
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>
                        O₂
                    </span>

                    <strong>
                        ${packing.o2 ?? "--"} %
                    </strong>
                </div>


                <div class="dato-publico">
                    <span>
                        CO₂
                    </span>

                    <strong>
                        ${packing.co2 ?? "--"} %
                    </strong>
                </div>

            </div>
        `;

    }


    catch (error) {

        console.error(
            "❌ Error al cargar packing:",
            error
        );

    }

}


// ==========================================
// 05. RECORRIDO
// ==========================================

async function cargarRecorridoPublico() {

    if (!idLote) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/recorrido`
            );


        if (!respuesta.ok) {

            console.log(
                "Este lote todavía no tiene recorrido registrado."
            );

            return;
        }


        const recorrido =
            await respuesta.json();


        console.log(
            "RECORRIDO RECIBIDO:",
            recorrido
        );


        ponerTexto(
            "rutaDespacho",
            recorrido.puertoSalida ||
            "Puerto de salida pendiente"
        );


        ponerTexto(
            "rutaEstado",
            recorrido.estadoEnvio ||
            "Estado pendiente"
        );


        ponerTexto(
            "rutaDestino",
            `${recorrido.ciudadDestino || "--"}, ${recorrido.paisDestino || "--"}`
        );


        ponerTexto(
            "rutaLlegada",
            recorrido.fechaLlegadaEstimada
                ? `Llegada estimada: ${formatearFecha(
                    recorrido.fechaLlegadaEstimada
                )}`
                : "Llegada pendiente"
        );

    }


    catch (error) {

        console.error(
            "❌ Error al cargar recorrido:",
            error
        );

    }

}


// ==========================================
// 06. NAVEGACIÓN / SWIPE
// ==========================================

const slider =
    document.querySelector(
        ".fp-slider"
    );


const slides =
    document.querySelectorAll(
        ".fp-slide"
    );


function irASlide(indice) {

    if (!slider) {
        return;
    }


    if (
        indice < 0 ||
        indice >= slides.length
    ) {
        return;
    }


    const slide =
        slides[indice];


    slider.scrollTo({
        left: slide.offsetLeft,
        behavior: "smooth"
    });

}


// ==========================================
// BOTONES DE NAVEGACIÓN
// ==========================================

slides.forEach(
    (slide, indice) => {

        const botones =
            slide.querySelectorAll(
                ".fp-nav-btn"
            );


        if (botones.length === 0) {
            return;
        }


        const botonAnterior =
            botones[0];


        const botonSiguiente =
            botones[
                botones.length - 1
            ];


        if (
            indice > 0 &&
            botonAnterior
        ) {

            botonAnterior.addEventListener(
                "click",
                () => {

                    irASlide(
                        indice - 1
                    );

                }
            );

        }


        if (
            indice < slides.length - 1 &&
            botonSiguiente
        ) {

            botonSiguiente.addEventListener(
                "click",
                () => {

                    irASlide(
                        indice + 1
                    );

                }
            );

        }

    }
);


// ==========================================
// CONTADOR DE PÁGINA
// ==========================================

const TOTAL_PAGINAS = 9;


function actualizarContadores() {

    slides.forEach(
        (slide, indice) => {

            const contador =
                slide.querySelector(
                    ".fp-contador"
                );


            if (!contador) {
                return;
            }


            const titulo =
                slide.dataset.title ||
                "";


            const numero =
                String(
                    indice + 1
                ).padStart(
                    2,
                    "0"
                );


            contador.textContent =
                `${numero} / ${String(TOTAL_PAGINAS).padStart(2, "0")}` +
                (
                    titulo
                        ? ` · ${titulo.toUpperCase()}`
                        : ""
                );

        }
    );

}


actualizarContadores();


// ==========================================
// INICIAR FICHA
// ==========================================

cargarFichaPublica();