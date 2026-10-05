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
// POPUPS DE INFORMACIÓN
// =========================================================

document.addEventListener(
    "click",
    (evento) => {

        const boton =
            evento.target.closest(
                "[data-popup]"
            );

        if (!boton) {
            return;
        }

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

        document
            .querySelectorAll(
                ".fp-calidad-popup"
            )
            .forEach(
                (item) => {

                    item.classList.remove(
                        "activo"
                    );

                }
            );

        if (!estabaActivo) {

            popup.classList.add(
                "activo"
            );

        }

    }
);
// =========================================================
// 05 · PACKING
// =========================================================

async function cargarPackingPublico() {
    const contenedor = document.getElementById("packingPublico");

    if (!contenedor) return;

    // Protege los datos que se insertan en el HTML.
    const escapar = (valor) =>
        String(valor ?? "--").replace(/[&<>"']/g, (caracter) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[caracter]));

    const conUnidad = (valor, unidad) =>
        valor == null || valor === ""
            ? "--"
            : `${valor} ${unidad}`;

    const fuentes = {
    popupPackingEmpaque: {
        nombre: "NC State Extension",
        url: "https://ncfreshproducesafety.ces.ncsu.edu/postharvest-produce-guide/produce-guide-blueberries/"
    },

    popupPackingPrefrio: {
        nombre: "University of Minnesota",
        url: "https://extension.umn.edu/agriculture/specialty-crops/commercial-fruit-production/postharvest-handling-of-fruit-and-vegetable-crops-in-minnesota"
    },

    popupPackingAlmacenamiento: {
        nombre: "UC Davis · Poscosecha",
        url: "https://postharvest.ucdavis.edu/produce-facts-sheets/bushberry"
    },

    popupPackingO2: {
        nombre: "UC Davis · Atmósferas modificadas",
        url: "https://postharvest.ucdavis.edu/produce-facts-sheets/bushberry"
    },

    popupPackingCO2: {
        nombre: "UC Davis · Atmósferas modificadas",
        url: "https://postharvest.ucdavis.edu/produce-facts-sheets/bushberry"
    }
};

    // Construye una tarjeta con su orejita y popup.
    function tarjeta(info) {
        return `
            <div class="fp-calidad-card fp-packing-card">

                <div class="fp-calidad-resumen">
                    <span>${info.etiqueta}</span>
                    <strong>${escapar(info.valor)}</strong>
                </div>

                <button
                    type="button"
                    class="fp-info-oreja"
                    data-popup="${info.id}"
                    aria-label="Información sobre ${info.titulo}"
                >?</button>

                <div
                    class="fp-calidad-popup"
                    id="${info.id}"
                >
                    <button
                        type="button"
                        class="fp-popup-cerrar"
                        data-popup="${info.id}"
                        aria-label="Cerrar información"
                    >×</button>

                    <span class="fp-info-kicker">
                        ¿QUÉ SIGNIFICA?
                    </span>

                    <h3>${info.titulo}</h3>

                    <p>${info.descripcion}</p>

                    <div class="fp-info-dato">
                        <strong>${info.detalleTitulo}</strong>
                        <span>${info.detalle}</span>
                    </div>

                    <div class="fp-info-dato">
                        <strong>¿Por qué nos importa?</strong>
                        <span>${info.importancia}</span>
                    </div>

                    ${info.imagen ? `
    <div class="fp-info-imagen">
        <img
            src="${info.imagen}"
            alt="Envase clamshell para arándanos"
            loading="lazy"
        >
    </div>
` : ""}

                    <div class="fp-info-fuente">
                        <span>Para leer más:</span>
                        <a
                            href="${fuentes[info.id].url}""
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${fuentes[info.id].nombre}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    try {
        const respuesta = await fetch(
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

        const packing = await respuesta.json();

        const indicadores = [
            {
                id: "popupPackingEmpaque",
                etiqueta: "EMPAQUE",
                titulo: "Empaque",
                valor: packing.tipoEmpaque || "--",
                imagen: "IMAGENES/arandano_clamshell.jpg",
               descripcion:
    "Es el envase que contiene y protege los arándanos durante su manipulación, almacenamiento y transporte.",

detalleTitulo: "¿Qué es un clamshell?",

detalle:
    "Es un envase con tapa unida al cuerpo, que se abre como una concha. Sus aberturas permiten la circulación del aire y facilitan el intercambio de calor y gases entre la fruta y el ambiente.",

importancia:
    "Su ventilación facilita que el aire frío llegue a los frutos durante el enfriamiento. Además, ayuda a protegerlos y permite ver su contenido."
            },
            {
                id: "popupPackingPrefrio",
                etiqueta: "TEMPERATURA DE PREFRÍO",
                titulo: "Prefrío",
                valor: conUnidad(packing.prefrioTemp, "°C"),
                descripcion:
                    "Es el enfriamiento inicial de la fruta después de la cosecha.",
                detalleTitulo: "Unidad",
                detalle:
                    "Grados Celsius (°C). Aquí se muestra la temperatura registrada para esta etapa.",
                importancia:
                    "Enfriar pronto ayuda a reducir la pérdida de agua, la respiración y el deterioro de los arándanos."
            },
            {
                id: "popupPackingAlmacenamiento",
                etiqueta: "TEMPERATURA DE ALMACENAMIENTO",
                titulo: "Almacenamiento en frío",
                valor: conUnidad(packing.temperaturaCamara, "°C"),
                descripcion:
                    "Es la temperatura registrada en la cámara donde se conserva el lote.",
                detalleTitulo: "Unidad",
                detalle:
                    "Grados Celsius (°C).",
                importancia:
                    "El almacenamiento en frío ayuda a retrasar el deterioro y conservar la calidad después del enfriamiento inicial."
            },
            {
                id: "popupPackingO2",
                etiqueta: "O₂",
                titulo: "Oxígeno",
                valor: conUnidad(packing.o2, "%"),
                descripcion:
                    "Indica la proporción de oxígeno registrada en la atmósfera de conservación.",
                detalleTitulo: "Unidad",
                detalle:
                    "Porcentaje (%). Es un dato del ambiente que rodea la fruta.",
                importancia:
                    "La modificación del oxígeno, combinada con frío y control del CO₂, puede ayudar a reducir la respiración y retrasar el ablandamiento."
            },
            {
                id: "popupPackingCO2",
                etiqueta: "CO₂",
                titulo: "Dióxido de carbono",
                valor: conUnidad(packing.co2, "%"),
                descripcion:
                    "Indica la proporción de dióxido de carbono registrada en la atmósfera de conservación.",
                detalleTitulo: "Unidad",
                detalle:
                    "Porcentaje (%). Se interpreta junto con el oxígeno y la temperatura.",
                importancia:
                    "Las atmósferas enriquecidas con CO₂ pueden ayudar a reducir el desarrollo de organismos que causan pudriciones."
            }
        ];

        contenedor.innerHTML = `
            <div class="grid-ficha-publica fp-packing-grid">

                <div class="dato-publico">
                    <span>Fecha de recepción</span>
                    <strong>
                        ${escapar(formatearFecha(packing.fechaRecepcion))}
                    </strong>
                </div>

                <div class="dato-publico">
                    <span>Fecha de packing</span>
                    <strong>
                        ${escapar(formatearFecha(packing.fechaPacking))}
                    </strong>
                </div>

                ${indicadores.map(tarjeta).join("")}

            </div>
        `;
    }
    catch (error) {
        console.error("❌ Error al cargar packing:", error);

        contenedor.innerHTML = `
            <p class="mensaje-proximamente">
                No se pudo cargar la información de packing.
                Intenta nuevamente.
            </p>
        `;
    }
}


// =========================================================
// 06 · RECORRIDO
// =========================================================

async function cargarRecorridoPublico() {
    if (!idLote) return;

    // Cambiar a false para consultar el recorrido de la API.
    const MOSTRAR_EJEMPLO = true;

const ejemplo = {
    fechaDespacho: "2024-10-20",
    fechaLlegadaEstimada: "2024-11-15",
    transportista: "Operador logístico de ejemplo",
    puertoSalida: "Callao, Perú",
    ciudadDestino: "North Vancouver, Columbia Británica",
    paisDestino: "Canadá",
    estadoEnvio: "En puerto de destino"
};

    function mostrarRecorrido(recorrido) {
        ponerTexto(
            "rutaFechaDespacho",
            formatearFecha(recorrido.fechaDespacho)
        );

        ponerTexto(
            "rutaLlegada",
            formatearFecha(recorrido.fechaLlegadaEstimada)
        );

        ponerTexto(
            "rutaTransportista",
            recorrido.transportista
                ? `Transportista: ${recorrido.transportista}`
                : "Transportista pendiente"
        );

        ponerTexto(
            "rutaDespacho",
            recorrido.puertoSalida
                ? `Puerto de origen: ${recorrido.puertoSalida}`
                : "Puerto de origen pendiente"
        );

        const destino = [
            recorrido.ciudadDestino,
            recorrido.paisDestino
        ].filter(Boolean).join(", ");

        ponerTexto(
            "rutaDestino",
            destino || "Destino pendiente"
        );

        ponerTexto(
            "rutaEstado",
            recorrido.estadoEnvio || "Sin registro"
        );
    }

    if (MOSTRAR_EJEMPLO) {
        mostrarRecorrido(ejemplo);

        ponerTexto(
    "avisoRecorrido",
    "EJEMPLO ILUSTRATIVO · Destino basado en la dirección del importador del ticket y fechas simuladas posteriores al packing del 18/10/2024. Operador, puerto de origen y estado ficticios."
);

        return;
    }

    mostrarRecorrido({});

    ponerTexto(
        "avisoRecorrido",
        "Consultando información del recorrido..."
    );

    try {
        const respuesta = await fetch(
            `${API_URL}/${idLote}/recorrido`
        );

        if (!respuesta.ok) {
            ponerTexto(
                "avisoRecorrido",
                "No se pudo obtener un recorrido registrado."
            );

            return;
        }

        const recorrido = await respuesta.json();

        mostrarRecorrido(recorrido || {});

        ponerTexto(
            "avisoRecorrido",
            "Información del recorrido registrada para este lote."
        );

    } catch (error) {
        console.error(
            "Error al cargar el recorrido:",
            error
        );

        ponerTexto(
            "avisoRecorrido",
            "No se pudo consultar el recorrido. Intenta nuevamente."
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
// FLECHA DE LA PORTADA
// ---------------------------------------------------------

const btnPortadaSiguiente =
    document.getElementById(
        "btnPortadaSiguiente"
    );


if (btnPortadaSiguiente && slider) {

    btnPortadaSiguiente.addEventListener(
        "click",
        () => {

            slider.scrollBy({
                left: slider.clientWidth,
                behavior: "smooth"
            });

        }
    );

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

const TOTAL_PAGINAS = slides.length;


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
function agregarFranjasPublicas() {
    const paginas = [
        ...document.querySelectorAll(".fp-slider > .fp-slide")
    ];

    const total = String(paginas.length).padStart(2, "0");

    paginas.forEach((pagina, indice) => {
        const contenedor = pagina.firstElementChild;

        if (!contenedor) return;

        if (contenedor.querySelector(".fp-slide-footer")) return;

        const franja = document.createElement("div");
        franja.className = "fp-slide-footer";

        const numero = document.createElement("span");
        numero.textContent =
            `${String(indice + 1).padStart(2, "0")} / ${total}`;

        const marcas = document.createElement("div");
        marcas.className = "fp-footer-marcas";
        marcas.setAttribute("aria-hidden", "true");

        paginas.forEach((_, posicion) => {
            const marca = document.createElement("span");

            if (posicion === indice) {
                marca.className = "activo";
            }

            marcas.appendChild(marca);
        });

        const titulo = document.createElement("strong");
        titulo.textContent =
            (pagina.dataset.title || "").toUpperCase();

        franja.append(numero, marcas, titulo);
        contenedor.appendChild(franja);
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        agregarFranjasPublicas,
        { once: true }
    );
} else {
    agregarFranjasPublicas();
}

// =========================================================
// INICIAR FICHA
// =========================================================
agregarFranjasPublicas();
cargarFichaPublica();
