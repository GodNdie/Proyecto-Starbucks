// public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const credenciales = {
    correo: document.getElementById('correo').value,
    contrasena: document.getElementById('contrasena').value
  };

  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credenciales)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); 
      alert('¡Inicio de sesión exitoso!');
      window.location.href = 'menu.html'; 
    } else {
      const error = await response.json();
      alert('Error de login: ' + (error.message || 'Credenciales inválidas'));
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
    console.error(error);
  }
});
