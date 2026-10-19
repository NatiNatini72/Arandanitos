// =========================================================
// 00 · CONFIGURACIÓN Y UTILIDADES
// =========================================================
const API_URL = `${API_BASE_URL}/api/lotes`;
const idLote = new URLSearchParams(window.location.search).get("id") || "1";
const ES_DEMO = idLote === "1";
const slider = document.querySelector(".fp-slider");
const slides = [...document.querySelectorAll(".fp-slider > .fp-slide")];
let botonPopupAbierto = null;

function ponerTexto(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor == null || valor === "" ? "--" : valor;
}

function mostrarMensaje(id, texto) {
    const elemento = document.getElementById(id);
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.hidden = !texto;
}

function conUnidad(valor, unidad) {
    return valor == null || valor === "" ? "--" : `${valor} ${unidad}`;
}

function formatearFecha(fecha) {
    if (!fecha) return "--";
    // Admite YYYY-MM-DD y fechas con hora de la API, sin convertir zona horaria.
    const partes = String(fecha).slice(0, 10).split("-");
    if (partes.length !== 3) return String(fecha);
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

async function consultarLote(seccion = "") {
    const respuesta = await fetch(`${API_URL}/${encodeURIComponent(idLote)}${seccion}`);
    if (respuesta.status === 404 || respuesta.status === 204) return null;
    if (!respuesta.ok) throw new Error(`Error de consulta: ${respuesta.status}`);
    return respuesta.json();
}

// =========================================================
// 01 · PORTADA
// =========================================================
function mostrarPortada(lote) {
    ponerTexto("codigoPublicoPortada", lote.codigo);
    ponerTexto("variedadPublica", lote.variedad);
    ponerTexto("codigoPublico", `LOTE: ${lote.lote || "--"}`);
    ponerTexto("fundoPublico", lote.fundo);
    ponerTexto("origenPublico", `${lote.region || "--"}, ${lote.pais || "--"}`);
}

// =========================================================
// 02 · ORIGEN
// =========================================================
function mostrarOrigen(lote) {
    ponerTexto("regionTituloOrigen", lote.region);
    ponerTexto("ubicacionFotoOrigen", `📍 ${lote.fundo || "Fundo"} · ${lote.region || "--"}, ${lote.pais || "--"}`);
    ponerTexto("paisPublico", lote.pais);
    ponerTexto("regionPublico", lote.region);
    ponerTexto("productorDetallePublico", lote.fundo);
    ponerTexto("exportadoraPublica", lote.exportadora);
    ponerTexto("lotePublico", lote.lote);
    ponerTexto("fechaPublica", formatearFecha(lote.fechaCosecha));
    ponerTexto("productorMapa", lote.fundo);
    // Chincha procede del ticket de la demo; no se presupone para otros lotes.
    const lugar = [ES_DEMO ? "Chincha" : "", lote.region, lote.pais].filter(Boolean).join(", ");
    ponerTexto("ubicacionMapa", lugar);
}

// =========================================================
// 03 · LOTE
// =========================================================
function mostrarLote(lote) {
    ponerTexto("codigoLoteSlide", lote.lote);
    ponerTexto("variedadLoteSlide", lote.variedad);
    ponerTexto("fundoLoteSlide", lote.fundo);
    ponerTexto("tituloInfoVariedad", `+ Entérate más sobre ${lote.variedad || "esta variedad"}`);
    const esVentura = String(lote.variedad || "").trim().toLowerCase().includes("ventura");
    document.getElementById("infoVentura").hidden = !esVentura;
    document.getElementById("infoOtraVariedad").hidden = esVentura;
}

// =========================================================
// 04 · CALIDAD
// Las descripciones están en HTML; aquí solo se cargan datos.
// =========================================================
function actualizarValoracionFirmeza(valor, unidad) {
    const numero = Number(valor);

    if (
        unidad !== "gf/mm" ||
        !Number.isFinite(numero) ||
        numero <= 0
    ) {
        ponerTexto("estrellasFirmeza", "☆☆☆☆☆");
        ponerTexto("categoriaFirmeza", "--");
        return;
    }

    let estrellas;
    let categoria;

    if (numero < 100) {
        estrellas = 1;
        categoria = "Muy blando";
    } else if (numero <= 120) {
        estrellas = 2;
        categoria = "Blando";
    } else if (numero <= 130) {
        estrellas = 3;
        categoria = "Sensible";
    } else if (numero <= 140) {
        estrellas = 4;
        categoria = "Firme";
    } else {
        estrellas = 5;
        categoria = "Muy firme";
    }

    ponerTexto(
        "estrellasFirmeza",
        "★".repeat(estrellas) + "☆".repeat(5 - estrellas)
    );

    ponerTexto("categoriaFirmeza", categoria);
}
function actualizarEstrellasCalidad(indicador, valor) {
    // Escalas ilustrativas de la demo, pendientes de validar.
    const escalas = {
        Calibre: {
            limites: [10, 12, 14, 18],
            etiquetas: [
                "Muy pequeño",
                "Pequeño",
                "Mediano",
                "Grande",
                "Muy grande"
            ]
        },

        Brix: {
            limites: [10, 12, 14, 16],
            etiquetas: [
                "Muy bajo",
                "Bajo",
                "Intermedio",
                "Alto",
                "Muy alto"
            ]
        },

        Acidez: {
            limites: [0.3, 0.5, 0.8, 1.3],
            etiquetas: [
                "Muy baja",
                "Baja",
                "Intermedia",
                "Alta",
                "Muy alta"
            ]
        }
    };

    const escala = escalas[indicador];

    if (!escala) return;

    const texto = String(valor ?? "").trim();
    const numero = Number(texto.replace(",", "."));

    if (
        texto === "" ||
        !Number.isFinite(numero) ||
        numero <= 0
    ) {
        ponerTexto(`estrellas${indicador}`, "☆☆☆☆☆");
        ponerTexto(`categoria${indicador}`, "--");
        return;
    }

    let nivel = 0;

    while (
        nivel < escala.limites.length &&
        numero > escala.limites[nivel]
    ) {
        nivel++;
    }

    const estrellas = nivel + 1;

    ponerTexto(
        `estrellas${indicador}`,
        "★".repeat(estrellas) + "☆".repeat(5 - estrellas)
    );

    ponerTexto(
        `categoria${indicador}`,
        `${escala.etiquetas[nivel]} · ${estrellas}/5`
    );
}
async function cargarCalidadPublica() {
    try {
        const calidad = await consultarLote("/calidad");
        if (!calidad) {
            mostrarMensaje("estadoCalidad", "Este lote todavía no tiene calidad registrada.");
            return;
        }
const firmezaDemo = 150;

ponerTexto("firmezaPublica", conUnidad(firmezaDemo, "gf/mm"));
actualizarValoracionFirmeza(firmezaDemo, "gf/mm");
        ponerTexto("calibrePublico", conUnidad(calidad.calibre, "mm"));
        ponerTexto("brixPublico", conUnidad(calidad.brix, "°Brix"));
        ponerTexto("acidezPublica", conUnidad(calidad.acidez, "%"));
        actualizarEstrellasCalidad("Calibre", calidad.calibre);
actualizarEstrellasCalidad("Brix", calidad.brix);
actualizarEstrellasCalidad("Acidez", calidad.acidez);
        mostrarMensaje("estadoCalidad", "");
    } catch (error) {
        console.error("Error al cargar calidad:", error);
        mostrarMensaje("estadoCalidad", "No se pudo consultar Calidad. Recarga la página para volver a intentarlo.");
    }
}

// =========================================================
// 05 · PACKING
// =========================================================
async function cargarPackingPublico() {
    try {
        const packing = await consultarLote("/packing");
        if (!packing) {
            mostrarMensaje("estadoPacking", "Este lote todavía no tiene packing registrado.");
            return;
        }
        ponerTexto("fechaRecepcionPublica", formatearFecha(packing.fechaRecepcion));
        ponerTexto("fechaPackingPublica", formatearFecha(packing.fechaPacking));
        ponerTexto("empaquePublico", packing.tipoEmpaque);
        ponerTexto("prefrioPublico", conUnidad(packing.prefrioTemp, "°C"));
        ponerTexto("almacenamientoPublico", conUnidad(packing.temperaturaCamara, "°C"));
        ponerTexto("o2Publico", conUnidad(packing.o2, "%"));
        ponerTexto("co2Publico", conUnidad(packing.co2, "%"));
        mostrarMensaje("estadoPacking", "");
    } catch (error) {
        console.error("Error al cargar packing:", error);
        mostrarMensaje("estadoPacking", "No se pudo consultar Packing. Recarga la página para volver a intentarlo.");
    }
}

// =========================================================
// 06 · RECORRIDO
// El historial ilustrativo de 2024 está en HTML y solo se
// muestra para id=1. La API actual no aporta ese historial.
// =========================================================
function mostrarRecorrido(recorrido) {
    ponerTexto("rutaFechaDespacho", formatearFecha(recorrido.fechaDespacho));
    ponerTexto("rutaLlegada", formatearFecha(recorrido.fechaLlegadaEstimada));
    ponerTexto("rutaTransportista", recorrido.transportista ? `Transportista: ${recorrido.transportista}` : "Transportista pendiente");
    ponerTexto("rutaDespacho", recorrido.puertoSalida ? `Puerto de origen: ${recorrido.puertoSalida}` : "Puerto de origen pendiente");
    ponerTexto("rutaDestino", [recorrido.ciudadDestino, recorrido.paisDestino].filter(Boolean).join(", ") || "Destino pendiente");
    ponerTexto("rutaEstado", recorrido.estadoEnvio || "Sin registro");
}

async function cargarRecorridoPublico() {
    if (ES_DEMO) {
        mostrarRecorrido({
            fechaDespacho: "2024-10-20",
            fechaLlegadaEstimada: "2024-11-15",
            transportista: "Operador logístico de ejemplo",
            puertoSalida: "Callao, Perú",
            ciudadDestino: "North Vancouver, Columbia Británica",
            paisDestino: "Canadá",
            estadoEnvio: "En puerto de destino"
        });
        document.querySelectorAll("[data-demo]").forEach(elemento => elemento.hidden = false);
        ponerTexto("avisoRecorrido", "EJEMPLO ILUSTRATIVO · Destino basado en la dirección del importador del ticket. Fechas de despacho y llegada, operador, puerto de origen y estado simulados. Packing del ticket: 18/10/2024.");
        return;
    }
    ponerTexto("avisoRecorrido", "Consultando información del recorrido…");
    try {
        const recorrido = await consultarLote("/recorrido");
        mostrarRecorrido(recorrido || {});
        ponerTexto("avisoRecorrido", recorrido ? "Información del recorrido registrada para este lote." : "Sin información de recorrido registrada.");
    } catch (error) {
        console.error("Error al cargar recorrido:", error);
        ponerTexto("avisoRecorrido", "No se pudo consultar Recorrido. Recarga la página para volver a intentarlo.");
    }
}

// =========================================================
// 07 · INTERACCIÓN COMÚN: POPUPS Y NAVEGACIÓN
// =========================================================
function cerrarPopups(devolverFoco = false) {
    document.querySelectorAll(".fp-calidad-popup").forEach(popup => popup.hidden = true);
    document.querySelectorAll(".fp-info-oreja").forEach(boton => boton.setAttribute("aria-expanded", "false"));
    document.querySelectorAll(".fp-calidad-card").forEach(tarjeta => tarjeta.classList.remove("popup-abierto"));
    if (devolverFoco && botonPopupAbierto) botonPopupAbierto.focus();
    botonPopupAbierto = null;
}

function iniciarPopups() {
    document.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-popup]");
        if (!boton) {
            if (!evento.target.closest(".fp-calidad-popup")) cerrarPopups();
            return;
        }
        const popup = document.getElementById(boton.dataset.popup);
        if (!popup) return;
        const estabaAbierto = !popup.hidden;
        const esCierre = boton.classList.contains("fp-popup-cerrar");
        cerrarPopups(esCierre);
        if (!estabaAbierto && !esCierre) {
            popup.hidden = false;
            boton.setAttribute("aria-expanded", "true");
            boton.closest(".fp-calidad-card").classList.add("popup-abierto");
            botonPopupAbierto = boton;
            popup.querySelector(".fp-popup-cerrar").focus({ preventScroll: true });
        }
    });
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") cerrarPopups(true);
    });
}

function irASlide(indice) {
    if (!slider || indice < 0 || indice >= slides.length) return;
    cerrarPopups();
    slider.scrollTo({ left: slides[indice].offsetLeft - slider.offsetLeft, behavior: "smooth" });
}

function iniciarNavegacion() {
    document.getElementById("btnPortadaSiguiente").addEventListener("click", () => irASlide(1));
    slides.forEach((slide, indice) => {
        slide.querySelectorAll("[data-direccion]").forEach(boton => {
            boton.addEventListener("click", () => irASlide(indice + Number(boton.dataset.direccion)));
        });
    });
}

// =========================================================
// INICIAR FICHA · ÚNICO PUNTO DE ARRANQUE
// El script se carga al final del body: el HTML ya existe.
// =========================================================
async function cargarFichaPublica() {
    const pantallaCarga = document.getElementById("estadoFicha");


if (!idLote) {
    mostrarMensaje("estadoFicha", "");
    return;
}

    pantallaCarga.classList.add("cargando");
    mostrarMensaje("estadoFicha", "");

    try {
        const lote = await consultarLote();

        if (!lote) {
            mostrarMensaje(
                "estadoFicha",
                "No encontramos la ficha. Vuelve a escanear la etiqueta NFC."
            );
            return;
        }

        mostrarPortada(lote);
        mostrarOrigen(lote);
        mostrarLote(lote);

        ponerTexto(
            "rutaOrigen",
            `${lote.fundo || "--"} · ${lote.region || "--"}, ${lote.pais || "--"}`
        );

        await cargarCalidadPublica();
        await cargarPackingPublico();
        await cargarRecorridoPublico();

        mostrarMensaje("estadoFicha", "");

    } catch (error) {
        console.error("Error al cargar ficha:", error);

        mostrarMensaje(
            "estadoFicha",
            "No pudimos cargar tu ficha. Revisa tu conexión e inténtalo nuevamente."
        );

    } finally {
        pantallaCarga.classList.remove("cargando");
    }
}

iniciarPopups();
iniciarNavegacion();
cargarFichaPublica();
