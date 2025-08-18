window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión');
    window.location.href = 'login.html';
    return;
  }
  try {
    const response = await fetch('http://localhost:8080/api/usuario/perfil', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.ok) {
      const usuario = await response.json();
      // Saludo principal
      document.getElementById('saludo').textContent = `¡Bienvenido, ${usuario.nombre}!`;
      document.getElementById('infoUsuario').textContent = `Consulta tu estado, recompensas y más.`;
      // Datos básicos
      document.getElementById('idUsuario').textContent = usuario.id;
      document.getElementById('correoUsuario').textContent = usuario.correo;
      document.getElementById('fechaRegistro').textContent = usuario.fechaRegistro;
      // Recompensas
      document.getElementById('puntosRewards').textContent = usuario.puntos;
      document.getElementById('progresoPuntos').value = usuario.puntos;
      document.getElementById('puntosRestantes').textContent = 100 - usuario.puntos;
      // Historial de pedidos
      const lista = document.getElementById('listaPedidos');
      lista.innerHTML = '';
      if (usuario.pedidos.length === 0) {
        lista.innerHTML = '<li>No tienes pedidos recientes.</li>';
      } else {
        usuario.pedidos.forEach(pedido => {
          const li = document.createElement('li');
          li.textContent = `☕ ${pedido.nombreCafe} - ${pedido.fecha}`;
          lista.appendChild(li);
        });
      }
      // Bebida favorita
      const favorita = usuario.favorito || null;
      const textoFavorita = document.getElementById('bebidaFavorita');
      textoFavorita.textContent = favorita ? `Tu favorita es: ${favorita}` : 'Aún no tienes una bebida favorita registrada.';
    } else {
      alert('Sesión inválida o expirada. Por favor inicia sesión nuevamente.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    alert('Error al conectar con el servidor.');
  }
});
// Cerrar sesión
document.getElementById('cerrarSesion').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
// Simulación de selección favorita
function seleccionarFavorita() {
  const nuevaFavorita = prompt("¿Cuál es tu bebida favorita?");
  if (nuevaFavorita) {
    document.getElementById('bebidaFavorita').textContent = `Tu favorita es: ${nuevaFavorita}`;
    
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}