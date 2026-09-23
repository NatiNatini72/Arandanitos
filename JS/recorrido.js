const STORAGE_KEY = 'recorridosLotes';



const formRecorrido = document.getElementById('formRecorrido');
const loteRecorrido = document.getElementById('loteRecorrido');
const resultadoRecorrido = document.getElementById('resultadoRecorrido');

function obtenerRecorridos() {
  try {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function guardarRecorridos(recorridos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recorridos));
}

async function poblarLotes() {

    try {

        const respuesta =
            await fetch(`${API_BASE_URL}/api/lotes`)

        const lotes =
            await respuesta.json();


        loteRecorrido.innerHTML =
            '<option value="">Selecciona un lote</option>';


        lotes.forEach((item) => {

            const opcion =
                document.createElement("option");

            opcion.value =
                item.id;

            opcion.textContent = item.lote;

            loteRecorrido.appendChild(opcion);

        });

    }

    catch (error) {

        console.error(
            "Error al cargar lotes:",
            error
        );

    }
}

function renderRecorrido(lote) {
  if (!lote) {
    resultadoRecorrido.innerHTML = '<p class="mensaje-proximamente">Selecciona un lote para consultar su recorrido.</p>';
    return;
  }

  const recorridos = obtenerRecorridos();
  const recorrido = recorridos
    .filter((item) => item.lote === lote)
    .sort((a, b) => new Date(b.fechaDespacho) - new Date(a.fechaDespacho))[0];

  if (!recorrido) {
    resultadoRecorrido.innerHTML = `
      <p class="mensaje-proximamente">
        Aún no hay recorrido registrado para <strong>${lote}</strong>.
      </p>
    `;
    return;
  }

  resultadoRecorrido.innerHTML = `
    <div class="detalle-recorrido">
      <p><strong>Lote:</strong> ${recorrido.lote}</p>
      <p><strong>Fecha de despacho:</strong> ${recorrido.fechaDespacho || '—'}</p>
      <p><strong>Transportista:</strong> ${recorrido.transportista || '—'}</p>
      <p><strong>Puerto de salida:</strong> ${recorrido.puertoSalida || '—'}</p>
      <p><strong>Estado del envío:</strong> ${recorrido.estadoEnvio || '—'}</p>
      <p><strong>País destino:</strong> ${recorrido.paisDestino || '—'}</p>
      <p><strong>Ciudad destino:</strong> ${recorrido.ciudadDestino || '—'}</p>
      <p><strong>Llegada estimada:</strong> ${recorrido.fechaLlegadaEstimada || '—'}</p>
      <p><strong>Observaciones:</strong> ${recorrido.observacionesRecorrido || 'Sin observaciones.'}</p>
    </div>
  `;
}

if (formRecorrido) {
  formRecorrido.addEventListener('submit', (event) => {
    event.preventDefault();

    const lote = document.getElementById('loteRecorrido').value;
    const fechaDespacho = document.getElementById('fechaDespacho').value;
    const transportista = document.getElementById('transportista').value.trim();
    const puertoSalida = document.getElementById('puertoSalida').value.trim();
    const estadoEnvio = document.getElementById('estadoEnvio').value;
    const paisDestino = document.getElementById('paisDestino').value.trim();
    const ciudadDestino = document.getElementById('ciudadDestino').value.trim();
    const fechaLlegadaEstimada = document.getElementById('fechaLlegadaEstimada').value;
    const observacionesRecorrido = document.getElementById('observacionesRecorrido').value.trim();

    if (!lote || !fechaDespacho) {
      alert('Debes seleccionar un lote y una fecha de despacho.');
      return;
    }

    const recorridos = obtenerRecorridos();
    const actualizado = recorridos.filter((item) => item.lote !== lote);

    actualizado.push({
      lote,
      fechaDespacho,
      transportista,
      puertoSalida,
      estadoEnvio,
      paisDestino,
      ciudadDestino,
      fechaLlegadaEstimada,
      observacionesRecorrido
    });

    guardarRecorridos(actualizado);
    poblarLotes();
    loteRecorrido.value = lote;
    renderRecorrido(lote);
    formRecorrido.reset();
    loteRecorrido.value = lote;
  });
} 

if (loteRecorrido) {
  loteRecorrido.addEventListener('change', (event) => {
    renderRecorrido(event.target.value);
  });
}

poblarLotes();
renderRecorrido('');