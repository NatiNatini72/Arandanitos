console.log("✅ ficha_publica.js está funcionando");


// =========================================================
// CONFIGURACIÓN
// =========================================================

const API_URL = `${API_BASE_URL}/api/lotes`;

const parametros = new URLSearchParams(
    window.location.search
);

const idLote = parametros.get("id");

console.log(
    "ID LOTE DESDE URL:",
    idLote
);


// =========================================================
// UTILIDADES
// =========================================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "--";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function ponerTexto(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        valor ?? "--";
}


function ponerHTML(id, contenido) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.innerHTML = contenido;
}


// =========================================================
// INFORMACIÓN DIVULGATIVA DE VARIEDAD
// =========================================================

function renderizarInfoVariedad(variedad) {

    const contenedor =
        document.getElementById(
            "infoVariedadPublica"
        );

    if (!contenedor) {
        return;
    }

    const nombre =
        (variedad || "")
            .trim()
            .toLowerCase();


    // -----------------------------------------------------
    // VENTURA
    // -----------------------------------------------------

    if (nombre.includes("ventura")) {

        contenedor.innerHTML = `

            <div class="fp-sabias-variedad">

                <span class="fp-sabias-etiqueta">
                    🫐 SABÍAS QUE...
                </span>

                <h4>
                    Ventura está hecha para viajar.
                </h4>

                <p>
                    Ventura es una variedad de arándano
                    ampliamente utilizada en la producción
                    peruana y con una presencia importante
                    en mercados de exportación.
                </p>


                <div class="fp-sabias-grid">

                    <div>
                        <strong>
                            ✈️ Buena viajera
                        </strong>

                        <p>
                            Es reconocida por características
                            que favorecen el transporte y la
                            comercialización a largas distancias.
                        </p>
                    </div>


                    <div>
                        <strong>
                            🫐 Buen calibre
                        </strong>

                        <p>
                            Se describe por presentar buen tamaño,
                            bloom y una apariencia comercial
                            atractiva.
                        </p>
                    </div>


                    <div>
                        <strong>
                            🌱 Productiva
                        </strong>

                        <p>
                            Su productividad ha contribuido
                            a su amplia presencia en campos
                            de producción peruanos.
                        </p>
                    </div>

                </div>


                <p class="fp-sabias-nota">
                    El comportamiento final del fruto también
                    depende del ambiente, manejo agronómico
                    y condiciones de producción.
                </p>


               <div class="fp-fuentes-variedad">

    <strong>
        Para seguir leyendo
    </strong>

    <ol>

        <li>
            <a
                href="https://blueberriesconsulting.com/ventura-mantiene-preferencia-de-la-fruta-peruana-en-los-mercadosle-sigue-sekoya/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Blueberries Consulting
            </a>
        </li>

        <li>
            <a
                href="https://redagricola.com/la-mejor-variedad-para-peru-es-una-ventura-pero-con-mejor-sabor/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Redagrícola
            </a>
        </li>

        <li>
            <a
                href="https://arandanosperu.pe/2025/01/17/consideran-el-arandano-ventura-mas-resistente-y-adecuado-para-exportacion/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Arándanos Perú
            </a>
        </li>

    </ol>

</div>

            </div>
        `;

        return;
    }


    // -----------------------------------------------------
    // OTRAS VARIEDADES
    // -----------------------------------------------------

    contenedor.innerHTML = `

        <div class="fp-sabias-variedad">

            <span class="fp-sabias-etiqueta">
                🫐 SABÍAS QUE...
            </span>

            <h4>
                ${variedad || "Esta variedad"}
            </h4>

            <p>
                Próximamente NECHDATA mostrará aquí
                información divulgativa específica
                de esta variedad.
            </p>

        </div>
    `;
}


// =========================================================
// CARGAR DATOS GENERALES DEL LOTE
// =========================================================

async function cargarFichaPublica() {

    if (!idLote) {

        console.error(
            "❌ No se recibió un ID de lote."
        );

        return;
    }


    try {

        console.log(
            "Consultando lote:",
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
            "✅ LOTE RECIBIDO:",
            lote
        );


        // =================================================
        // 01 · PORTADA
        // =================================================

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


        // =================================================
        // 02 · ORIGEN
        // =================================================

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


        // =================================================
        // 03 · LOTE
        // =================================================

        ponerTexto(
            "codigoLoteSlide",
            lote.lote
        );


        ponerTexto(
            "variedadLoteSlide",
            lote.variedad
        );


        ponerTexto(
            "fundoLoteSlide",
            lote.fundo
        );


        ponerTexto(
            "tituloInfoVariedad",
            `+ Entérate más sobre ${lote.variedad || "esta variedad"}`
        );


        renderizarInfoVariedad(
            lote.variedad
        );


        // =================================================
        // 06 · RECORRIDO
        // ORIGEN DEL TIMELINE
        // =================================================

        ponerTexto(
            "rutaOrigen",
            `${lote.fundo || "--"} · ${lote.region || "--"}, ${lote.pais || "--"}`
        );


        // =================================================
        // CARGAR SECCIONES COMPLEMENTARIAS
        // =================================================

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


// =========================================================
// 04 · CALIDAD
// =========================================================

async function cargarCalidadPublica() {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/${idLote}/calidad`
            );


        if (!respuesta.ok) {

            console.log(
                "ℹ️ Este lote todavía no tiene calidad registrada."
            );

            return;
        }


        const calidad =
            await respuesta.json();


        console.log(
            "✅ CALIDAD RECIBIDA:",
            calidad
        );


        ponerTexto(
            "firmezaPublica",
            calidad.firmeza ?? "--"
        );


        ponerTexto(
            "calibrePublico",
            calidad.calibre != null
                ? `${calidad.calibre} mm`
                : "--"
        );


        ponerTexto(
            "brixPublico",
            calidad.brix != null
                ? `${calidad.brix} °Brix`
                : "--"
        );


        ponerTexto(
            "acidezPublica",
            calidad.acidez ?? "--"
        );


        ponerTexto(
            "defectosPublico",
            calidad.defectos != null
                ? `${calidad.defectos} %`
                : "--"
        );


        ponerTexto(
            "observacionesCalidadPublica",
            calidad.observaciones ||
            "Sin observaciones registradas."
        );

    }

    catch (error) {

        console.error(
            "❌ Error al cargar calidad:",
            error
        );
    }
}

// =========================================================
// POPUPS DE CALIDAD
// =========================================================

document.querySelectorAll(
    "[data-popup]"
).forEach(
    (boton) => {

        boton.addEventListener(
            "click",
            () => {

                const idPopup =
                    boton.dataset.popup;

                const popup =
                    document.getElementById(
                        idPopup
                    );

                if (!popup) {
                    return;
                }


                const estabaActivo =
                    popup.classList.contains(
                        "activo"
                    );


                // CERRAR TODOS

                document.querySelectorAll(
                    ".fp-calidad-popup"
                ).forEach(
                    (item) => {

                        item.classList.remove(
                            "activo"
                        );
                    }
                );


                // SI ESTABA CERRADO, ABRIRLO

                if (!estabaActivo) {

                    popup.classList.add(
                        "activo"
                    );
                }

            }
        );

    }
);

// =========================================================
// 05 · PACKING
// =========================================================

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


        console.log(
            "✅ PACKING RECIBIDO:",
            packing
        );


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


// =========================================================
// 06 · RECORRIDO
// =========================================================

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
                "ℹ️ Este lote todavía no tiene recorrido registrado."
            );

            return;
        }


        const recorrido =
            await respuesta.json();


        console.log(
            "✅ RECORRIDO RECIBIDO:",
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


// =========================================================
// 07 · NAVEGACIÓN / SWIPE
// =========================================================

const slider =
    document.querySelector(
        ".fp-slider"
    );


const slides =
    document.querySelectorAll(
        ".fp-slide"
    );


// ---------------------------------------------------------
// IR A UN SLIDE
// ---------------------------------------------------------

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


// ---------------------------------------------------------
// BOTONES ANTERIOR / SIGUIENTE
// ---------------------------------------------------------

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


        // ANTERIOR

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


        // SIGUIENTE

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


// =========================================================
// CONTADOR DE PÁGINA
// =========================================================

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
                slide.dataset.title || "";


            const numero =
                String(
                    indice + 1
                ).padStart(
                    2,
                    "0"
                );


            const total =
                String(
                    TOTAL_PAGINAS
                ).padStart(
                    2,
                    "0"
                );


            contador.textContent =
                `${numero} / ${total}` +
                (
                    titulo
                        ? ` · ${titulo.toUpperCase()}`
                        : ""
                );

        }
    );
}


actualizarContadores();


// =========================================================
// INICIAR FICHA
// =========================================================

cargarFichaPublica();