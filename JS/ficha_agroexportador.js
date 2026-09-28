const API_URL = `${API_BASE_URL}/api/lotes`;

const loteFicha =
    document.getElementById("loteFicha");

const fichaAgroContenido =
    document.getElementById("fichaAgroContenido");


async function cargarLotesFicha() {

    try {

        const respuesta =
            await fetch(API_URL);

        const lotes =
            await respuesta.json();

        loteFicha.innerHTML =
            '<option value="">Seleccionar lote</option>';

        lotes.forEach((item) => {

            const opcion =
                document.createElement("option");

            opcion.value =
                item.id;

            opcion.textContent =
                item.lote;

            loteFicha.appendChild(
                opcion
            );

        });

    }

    catch (error) {

        console.error(
            "Error al cargar lotes:",
            error
        );

    }

}

async function cargarFichaAgro(idLote) {

    if (!idLote) {

        fichaAgroContenido.innerHTML = `
            <h2>Resumen del lote</h2>

            <p>
                Selecciona un lote para visualizar su información completa.
            </p>
        `;

        return;
    }

    try {

        const respuestaLote =
            await fetch(
                `${API_URL}/${idLote}`
            );

        const lote =
            await respuestaLote.json();


        const respuestaCalidad =
            await fetch(
                `${API_URL}/${idLote}/calidad`
            );

        const calidad =
            respuestaCalidad.ok
                ? await respuestaCalidad.json()
                : null;


        const respuestaPacking =
            await fetch(
                `${API_URL}/${idLote}/packing`
            );

        const packing =
            respuestaPacking.ok
                ? await respuestaPacking.json()
                : null;


        const respuestaRecorrido =
            await fetch(
                `${API_URL}/${idLote}/recorrido`
            );

        const recorrido =
            respuestaRecorrido.ok
                ? await respuestaRecorrido.json()
                : null;


        const respuestaDocumentos =
            await fetch(
                `${API_URL}/${idLote}/documentos`
            );

        const documentos =
            respuestaDocumentos.ok
                ? await respuestaDocumentos.json()
                : [];


        fichaAgroContenido.innerHTML = `

            <div class="titulo-seccion">

                <div class="icono-seccion">
                    📋
                </div>

                <div>
                    <h2>
                        LOTE: ${lote.lote}
                    </h2>

                    <p>
                        Ficha técnica consolidada
                    </p>
                </div>

            </div>


            <h3>🌱 Producción y cosecha</h3>

            <div class="grid-ficha-publica">

                <div class="dato-publico">
                    <span>ID NECHDATA</span>
                    <strong>${lote.codigo}</strong>
                </div>

                <div class="dato-publico">
                    <span>Productor</span>
                    <strong>${lote.fundo}</strong>
                </div>

                <div class="dato-publico">
                    <span>Exportador</span>
                    <strong>${lote.exportadora || "--"}</strong>
                </div>

                <div class="dato-publico">
                    <span>País</span>
                    <strong>${lote.pais}</strong>
                </div>

                <div class="dato-publico">
                    <span>Departamento</span>
                    <strong>${lote.region}</strong>
                </div>

                <div class="dato-publico">
                    <span>Variedad</span>
                    <strong>${lote.variedad}</strong>
                </div>

                <div class="dato-publico">
                    <span>Fecha de cosecha</span>
                    <strong>${lote.fechaCosecha || "--"}</strong>
                </div>

            </div>


            <h3>🛡 Calidad</h3>

            ${
                calidad
                    ? `
                    <div class="grid-ficha-publica">

                        <div class="dato-publico">
                            <span>Calibre</span>
                            <strong>${calidad.calibre ?? "--"} mm</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Firmeza</span>
                            <strong>${calidad.firmeza ?? "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>°Brix</span>
                            <strong>${calidad.brix ?? "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Acidez</span>
                            <strong>${calidad.acidez ?? "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Defectos</span>
                            <strong>${calidad.defectos ?? "--"} %</strong>
                        </div>

                    </div>
                    `
                    : `<p>Sin información de calidad.</p>`
            }


            <h3>📦 Packing y poscosecha</h3>

            ${
                packing
                    ? `
                    <div class="grid-ficha-publica">

                        <div class="dato-publico">
                            <span>Fecha packing</span>
                            <strong>${packing.fechaPacking || "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Empaque</span>
                            <strong>${packing.tipoEmpaque || "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Pre-frío</span>
                            <strong>${packing.prefrioTemp ?? "--"} °C</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Cámara</span>
                            <strong>${packing.temperaturaCamara ?? "--"} °C</strong>
                        </div>

                        <div class="dato-publico">
                            <span>O₂</span>
                            <strong>${packing.o2 ?? "--"} %</strong>
                        </div>

                        <div class="dato-publico">
                            <span>CO₂</span>
                            <strong>${packing.co2 ?? "--"} %</strong>
                        </div>

                    </div>
                    `
                    : `<p>Sin información de packing.</p>`
            }


            <h3>📍 Recorrido</h3>

            ${
                recorrido
                    ? `
                    <div class="grid-ficha-publica">

                        <div class="dato-publico">
                            <span>Puerto de salida</span>
                            <strong>${recorrido.puertoSalida || "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Estado</span>
                            <strong>${recorrido.estadoEnvio || "--"}</strong>
                        </div>

                        <div class="dato-publico">
                            <span>Destino</span>
                            <strong>
                                ${recorrido.ciudadDestino || "--"},
                                ${recorrido.paisDestino || "--"}
                            </strong>
                        </div>

                        <div class="dato-publico">
                            <span>Llegada estimada</span>
                            <strong>${recorrido.fechaLlegadaEstimada || "--"}</strong>
                        </div>

                    </div>
                    `
                    : `<p>Sin información de recorrido.</p>`
            }


            <h3>📄 Documentos y certificaciones</h3>

            ${
                documentos.length > 0
                    ? documentos.map(doc => `
                        <div class="dato-publico">
                            <span>${doc.tipoDocumento || "Documento"}</span>
                            <strong>${doc.nombreDocumento || "--"}</strong>
                        </div>
                    `).join("")
                    : `<p>Sin documentos registrados.</p>`
            }

        `;

    }

    catch (error) {

        console.error(
            "Error al cargar ficha final:",
            error
        );

        fichaAgroContenido.innerHTML = `
            <p>
                No fue posible cargar la ficha del lote.
            </p>
        `;

    }

}

loteFicha.addEventListener(
    "change",
    function() {

        cargarFichaAgro(
            this.value
        );

    }
);
cargarLotesFicha();