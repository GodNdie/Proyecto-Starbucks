document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const cafeId = parseInt(params.get('cafeId'));
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  let personalizacionesGlobal = {};

  try {
    const res = await fetch("http://localhost:8080/api/personalizaciones");
    const data = await res.json();
    personalizacionesGlobal = data;

    cargarOpciones(data, 'leche', 'tipo-leche');
    cargarOpciones(data, 'temperatura', 'temperatura');
    cargarOpcionesFiltrando(data, 'extra', 'crema-batida', 'Crema batida');
    cargarOpciones(data, 'extra', 'adicionales');
    cargarOpciones(data, 'endulzante', 'adicionales');
    cargarOpciones(data, 'hielo', 'adicionales');

  } catch (error) {
    alert("No se pudo cargar personalizaciones.");
    console.error(error);
  }

  document.getElementById("personalizarForm").addEventListener("submit", async e => {
    e.preventDefault();

    const cantidad = parseInt(document.getElementById("cantidad").value);
    const leche = document.getElementById("tipo-leche").value;
    const temperatura = document.getElementById("temperatura").value;
    const cremaBatida = document.getElementById("crema-batida").value;
    const adicionales = Array.from(document.getElementById("adicionales").selectedOptions).map(opt => opt.value);

    const valoresSeleccionados = [leche, cremaBatida, ...adicionales];

    const personalizacionesId = Object.values(personalizacionesGlobal)
      .flat()
      .filter(p => valoresSeleccionados.includes(p.valor))
      .map(p => p.id);

    if (!cafeId || cantidad < 1 || !temperatura) {
      return alert("Completa todos los campos para continuar.");
    }

    const body = { cafeId, cantidad, temperatura, personalizacionesId };
    console.log("Body del pedido:", body);

    try {
      const res = await fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("☕ Pedido registrado con éxito");
        window.location.href = "index.html";
      } else {
        alert("❌ Error al registrar el pedido");
      }
    } catch (err) {
      alert("⚠️ Error al conectar con el servidor");
      console.error(err);
    }
  });
});

function modificarCantidad(cambio) {
  const input = document.getElementById('cantidad');
  let valor = parseInt(input.value);
  valor = isNaN(valor) ? 1 : valor + cambio;
  if (valor < 1) valor = 1;
  input.value = valor;
}

function cargarOpciones(data, tipo, selectId) {
  const select = document.getElementById(selectId);
  if (!select || !data[tipo]) return;

  data[tipo].forEach(p => {
    const option = document.createElement("option");
    option.value = p.valor;
    option.textContent = p.valor;
    select.appendChild(option);
  });
}

function cargarOpcionesFiltrando(data, tipo, selectId, valorBuscado) {
  const select = document.getElementById(selectId);
  if (!select || !data[tipo]) return;

  const item = data[tipo].find(p => p.valor === valorBuscado);
  if (item) {
    const option = document.createElement("option");
    option.value = item.valor;
    option.textContent = item.valor;
    select.appendChild(option);
  }
}
