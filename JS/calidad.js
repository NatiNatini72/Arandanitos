const API_URL = `${API_BASE_URL}/api/lotes`;

const loteCalidad =
    document.getElementById("loteCalidad");

const formCalidad =
    document.getElementById("formCalidad");

const resultadoCalidad =
    document.getElementById("resultadoCalidad");

const calibre =
    document.getElementById("calibre");

const firmeza =
    document.getElementById("firmeza");

const brix =
    document.getElementById("brix");

const acidez =
    document.getElementById("acidez");

const defectos =
    document.getElementById("defectos");

const observaciones =
    document.getElementById("observaciones");


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

            opcion.textContent = item.lote;

            loteCalidad.appendChild(opcion);

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
// CONSULTAR CALIDAD
// ==========================================

async function consultarCalidad() {

    const id =
        loteCalidad.value;


    if (!id) {

        resultadoCalidad.innerHTML = `
          <p class="mensaje-proximamente">
            Selecciona un lote para consultar su calidad.
          </p>
        `;

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}/calidad`
            );


        if (!respuesta.ok) {

            resultadoCalidad.innerHTML = `
              <p class="mensaje-proximamente">
                Este lote todavía no tiene información de calidad registrada.
              </p>
            `;

            return;

        }


        const calidad =
            await respuesta.json();


        resultadoCalidad.innerHTML = `

          <div class="grid-calidad">

            <div class="dato-calidad">
              <span>Calibre</span>
              <strong>${calidad.calibre ?? "--"} mm</strong>
            </div>

            <div class="dato-calidad">
              <span>Firmeza</span>
              <strong>${calidad.firmeza ?? "--"}</strong>
            </div>

            <div class="dato-calidad">
              <span>°Brix</span>
              <strong>${calidad.brix ?? "--"}</strong>
            </div>

            <div class="dato-calidad">
              <span>Acidez</span>
              <strong>${calidad.acidez ?? "--"}</strong>
            </div>

            <div class="dato-calidad">
              <span>Defectos</span>
              <strong>${calidad.defectos ?? "--"} %</strong>
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
            "Error al consultar calidad:",
            error
        );

    }

}


// ==========================================
// GUARDAR CALIDAD
// ==========================================

formCalidad.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        const id =
            loteCalidad.value;


        if (!id) {

            alert(
                "Selecciona un lote."
            );

            return;

        }


        const datos = {

            calibre:
                calibre.value
                    ? parseFloat(calibre.value)
                    : null,

            firmeza:
                firmeza.value
                    ? parseFloat(firmeza.value)
                    : null,

            brix:
                brix.value
                    ? parseFloat(brix.value)
                    : null,

            acidez:
                acidez.value
                    ? parseFloat(acidez.value)
                    : null,

            defectos:
                defectos.value
                    ? parseFloat(defectos.value)
                    : null,

            observaciones:
                observaciones.value
        };


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/${id}/calidad`,
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
                "✅ Calidad registrada correctamente."
            );


            await consultarCalidad();

        }

        catch (error) {

            console.error(error);

            alert(
                "❌ No se pudo registrar la calidad."
            );

        }

    }
);


// ==========================================
// CAMBIAR LOTE
// ==========================================

loteCalidad.addEventListener(
    "change",
    consultarCalidad
);


// ==========================================
// INICIAR
// ==========================================

cargarLotes();