document.addEventListener('DOMContentLoaded', () => {
  cargarPerfil();
  cargarCafes();
  inicializarBuscador();
  inicializarFiltro();
});

async function cargarPerfil() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/usuario/perfil', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });

    if (response.ok) {
      const usuario = await response.json();
      document.getElementById('authArea').innerHTML = `👤 ${usuario.nombre} (ID ${usuario.id})`;
      document.getElementById('saludoUsuario').textContent = `Hola 👋, ${usuario.nombre}`;
      document.getElementById('sugerenciaCafe').textContent = `Hoy te recomendamos probar un ${usuario.recomendacion || 'Caramel Macchiato'}.`;
    } else {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error);
  }
}


const cafes = [
  {
    nombre: "Latte",
    descripcion: "Café espresso con leche vaporizada",
    precio: "S/. 13.50",
    imagen: "../img/latte-convertido-de-jpeg.png ",
    categoria: "calientes"
  
  }
];

// Referencia al contenedor
const contenedorCafes = document.getElementById("cafes-container");

// Render dinámico
cafes.forEach(cafe => {
  const card = document.createElement("div");
  card.classList.add("producto");

  card.innerHTML = `
    <img src="${cafe.imagen}" alt="${cafe.nombre}">
    <h3>${cafe.nombre}</h3>
    <p>${cafe.descripcion}</p>
    <p class="precio">${cafe.precio}</p>
    <button class="btn">Personalizar</button>
  `;

  contenedorCafes.appendChild(card);
});

async function cargarCafes() {
  try {
    const response = await fetch('http://localhost:8080/api/cafes');
    const cafes = await response.json();
    renderizarCafes(cafes);
    renderizarDestacados(cafes);
  } catch (err) {
    console.error('Error al obtener cafés:', err);
    document.getElementById('cafes-container').innerHTML = '<p>Error al cargar cafés.</p>';
  }
}

function renderizarCafes(lista) {
  const container = document.getElementById('cafes-container');
  container.innerHTML = '';
  lista.forEach(cafe => {
    const card = document.createElement('div');
    card.className = 'cafe-card';
    card.dataset.categoria = cafe.categoria;
    card.dataset.destacado = cafe.destacado ? 'true' : 'false';
    card.innerHTML = `
      <h3>${cafe.nombre}</h3>
      <p>${cafe.descripcion}</p>
      <p><strong>S/. ${cafe.precio.toFixed(2)}</strong></p>
      <button onclick="personalizarPedido(${cafe.id})">Personalizar</button>
    `;
    container.appendChild(card);
  });
}

function renderizarDestacados(lista) {
  const container = document.getElementById('destacados-container');
  container.innerHTML = '';
  lista
    .filter(cafe => cafe.destacado)
    .forEach(cafe => {
      const card = document.createElement('div');
      card.className = 'cafe-card';
      card.innerHTML = `
        <h3>${cafe.nombre}</h3>
        <p>${cafe.descripcion}</p>
        <p><strong>S/. ${cafe.precio.toFixed(2)}</strong></p>
        <button onclick="personalizarPedido(${cafe.id})">Personalizar</button>
      `;
      container.appendChild(card);
    });
}

function personalizarPedido(id) {
  window.location.href = `personalizar.html?cafeId=${id}`;
}

function inicializarBuscador() {
  document.getElementById('buscadorCafe').addEventListener('input', e => {
    const filtro = e.target.value.toLowerCase();
    document.querySelectorAll('.cafe-card').forEach(card => {
      const nombre = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = nombre.includes(filtro) ? 'block' : 'none';
    });
  });
}

function inicializarFiltro() {
  document.getElementById('filtroCategoria').addEventListener('change', e => {
    const valor = e.target.value;
    document.querySelectorAll('.cafe-card').forEach(card => {
      const cat = card.dataset.categoria;
      const dest = card.dataset.destacado === 'true';
      if (
        valor === 'todos' ||
        (valor === 'calientes' && cat === 'calientes') ||
        (valor === 'frias' && cat === 'frias') ||
        (valor === 'destacados' && dest)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
