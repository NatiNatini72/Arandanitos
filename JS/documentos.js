const API_URL = `${API_BASE_URL}/api/lotes`;


const formDocumento =
  document.getElementById(
    "formDocumento"
  );


const selectorLote =
  document.getElementById(
    "loteDocumento"
  );


const listaDocumentos =
  document.getElementById(
    "listaDocumentos"
  );


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


    selectorLote.innerHTML = `

      <option value="">
        Seleccionar lote
      </option>

    `;


    lotes.forEach(lote => {

      const opcion =
        document.createElement(
          "option"
        );

      opcion.value =
        lote.id;

      opcion.textContent =
        `${lote.codigo} · ${lote.variedad} · ${lote.fundo}`;

      selectorLote.appendChild(
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


// ==========================================
// CONSULTAR DOCUMENTOS
// ==========================================

async function cargarDocumentos() {

  const idLote =
    selectorLote.value;


  if (!idLote) {

    listaDocumentos.innerHTML = `

      <p class="mensaje-proximamente">
        Selecciona un lote para consultar sus documentos.
      </p>

    `;

    return;

  }


  try {

    const respuesta =
      await fetch(
        `${API_URL}/${idLote}/documentos`
      );


    if (!respuesta.ok) {

      listaDocumentos.innerHTML = `

        <p class="mensaje-proximamente">
          Este lote todavía no tiene documentos registrados.
        </p>

      `;

      return;

    }


    const documentos =
      await respuesta.json();


    if (documentos.length === 0) {

      listaDocumentos.innerHTML = `

        <p class="mensaje-proximamente">
          Este lote todavía no tiene documentos registrados.
        </p>

      `;

      return;

    }


    listaDocumentos.innerHTML =
      documentos.map(documento => `

        <div class="documento-item">

          <div class="documento-icono">
            📄
          </div>


          <div class="documento-info">

            <span class="documento-tipo">
              ${documento.tipoDocumento || "Documento"}
            </span>

            <h3>
              ${documento.nombreDocumento || "Sin nombre"}
            </h3>

            <p>
              Código:
              <strong>
                ${documento.numeroDocumento || "--"}
              </strong>
            </p>

            <p>
              Entidad:
              <strong>
                ${documento.entidadEmisora || "--"}
              </strong>
            </p>

            <p>
              Emisión:
              <strong>
                ${formatearFecha(
                  documento.fechaEmision
                )}
              </strong>
            </p>

          </div>


          <div class="documento-acciones">

            ${
              documento.urlDocumento
                ?
                `
                  <a
                    href="${documento.urlDocumento}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-secundario"
                  >
                    Ver documento
                  </a>
                `
                :
                ""
            }

          </div>

        </div>

      `).join("");

  }

  catch (error) {

    console.error(
      "Error al consultar documentos:",
      error
    );

  }

}


// ==========================================
// GUARDAR DOCUMENTO
// ==========================================

formDocumento.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const idLote =
      selectorLote.value;


    if (!idLote) {

      alert(
        "Selecciona un lote."
      );

      return;

    }


    const datos = {

      tipoDocumento:
        document.getElementById(
          "tipoDocumento"
        ).value,

      nombreDocumento:
        document.getElementById(
          "nombreDocumento"
        ).value,

      numeroDocumento:
        document.getElementById(
          "numeroDocumento"
        ).value,

      fechaEmision:
        document.getElementById(
          "fechaEmision"
        ).value,

      entidadEmisora:
        document.getElementById(
          "entidadEmisora"
        ).value,

      urlDocumento:
        document.getElementById(
          "urlDocumento"
        ).value,

      observaciones:
        document.getElementById(
          "observacionesDocumento"
        ).value

    };


    try {

      const respuesta =
        await fetch(
          `${API_URL}/${idLote}/documentos`,
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
          "No se pudo guardar el documento."
        );

      }


      alert(
        "Documento registrado correctamente 📄"
      );


      await cargarDocumentos();

    }

    catch (error) {

      console.error(
        "Error al guardar documento:",
        error
      );

      alert(
        "No fue posible guardar el documento."
      );

    }

  }
);


// ==========================================
// CAMBIO DE LOTE
// ==========================================

selectorLote.addEventListener(
  "change",
  cargarDocumentos
);


// ==========================================
// INICIAR
// ==========================================

cargarLotes();