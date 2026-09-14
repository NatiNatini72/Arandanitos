const API_URL = "http://127.0.0.1:5000/api/lotes";

let lotes = [];

const busquedaGeneral =
    document.getElementById("busquedaGeneral");

const filtroPais =
    document.getElementById("filtroPais");

const filtroVariedad =
    document.getElementById("filtroVariedad");

const btnLimpiarFiltros =
    document.getElementById("btnLimpiarFiltros");

const contenedorResultados =
    document.getElementById("contenedorResultados");

const cantidadResultados =
    document.getElementById("cantidadResultados");


// ==========================================
// CARGAR LOTES
// ==========================================

async function cargarLotes() {

    try {

        const respuesta =
            await fetch(API_URL);

        lotes =
            await respuesta.json();

        mostrarResultados(lotes);

    }

    catch (error) {

        console.error(
            "Error al cargar lotes:",
            error
        );

        cantidadResultados.textContent =
            "No fue posible conectar con la base de datos.";

    }

}


// ==========================================
// MOSTRAR RESULTADOS
// ==========================================

function mostrarResultados(lista) {

    contenedorResultados.innerHTML = "";

    cantidadResultados.textContent =
        `${lista.length} lote(s) encontrado(s)`;


    if (lista.length === 0) {

        contenedorResultados.innerHTML = `
          <div class="sin-resultados">
            🔍 No se encontraron lotes con esos criterios.
          </div>
        `;

        return;

    }


    lista.forEach(item => {

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "resultado-lote";


        tarjeta.innerHTML = `

          <div class="resultado-codigo">

            <span>
              Código
            </span>

            <strong>
              ${item.codigo}
            </strong>

          </div>


          <div class="resultado-info">

            <div>

              <span>
                Fundo
              </span>

              <strong>
                ${item.fundo}
              </strong>

            </div>


            <div>

              <span>
                Lote
              </span>

              <strong>
                ${item.lote}
              </strong>

            </div>


            <div>

              <span>
                Variedad
              </span>

              <strong>
                ${item.variedad}
              </strong>

            </div>


            <div>

              <span>
                Región
              </span>

              <strong>
                ${item.region}
              </strong>

            </div>

          </div>


          <a
            href="detalle_lote.html?id=${item.id}"
            class="btn btn-principal"
          >
            👁 Ver ficha
          </a>

        `;


        contenedorResultados.appendChild(
            tarjeta
        );

    });

}


// ==========================================
// FILTRAR
// ==========================================

function filtrarLotes() {

    const texto =
        busquedaGeneral.value
            .toLowerCase()
            .trim();

    const paisSeleccionado =
        filtroPais.value;

    const variedadSeleccionada =
        filtroVariedad.value;


    const resultados =
        lotes.filter(item => {

            const coincideTexto =

                item.codigo
                    .toLowerCase()
                    .includes(texto)

                ||

                item.fundo
                    .toLowerCase()
                    .includes(texto)

                ||

                item.lote
                    .toLowerCase()
                    .includes(texto)

                ||

                item.variedad
                    .toLowerCase()
                    .includes(texto)

                ||

                item.region
                    .toLowerCase()
                    .includes(texto);


            const coincidePais =

                paisSeleccionado === ""

                ||

                item.pais ===
                    paisSeleccionado;


            const coincideVariedad =

                variedadSeleccionada === ""

                ||

                item.variedad ===
                    variedadSeleccionada;


            return (
                coincideTexto
                &&
                coincidePais
                &&
                coincideVariedad
            );

        });


    mostrarResultados(
        resultados
    );

}


// ==========================================
// EVENTOS
// ==========================================

busquedaGeneral.addEventListener(
    "input",
    filtrarLotes
);


filtroPais.addEventListener(
    "change",
    filtrarLotes
);


filtroVariedad.addEventListener(
    "change",
    filtrarLotes
);


btnLimpiarFiltros.addEventListener(
    "click",
    function() {

        busquedaGeneral.value = "";

        filtroPais.value = "";

        filtroVariedad.value = "";

        mostrarResultados(
            lotes
        );

    }
);


// ==========================================
// INICIAR
// ==========================================

cargarLotes();