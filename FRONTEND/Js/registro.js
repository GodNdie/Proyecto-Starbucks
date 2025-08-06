document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const usuario = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    correo: document.getElementById('correo').value,
    dni: document.getElementById('dni').value,
    telefono: document.getElementById('telefono').value,
    contrasena: document.getElementById('contrasena').value
  };

  try {
    const response = await fetch('http://localhost:8080/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    if (response.ok) {
      alert('¡Registro exitoso!');
      window.location.href = 'login.html';
    } else {
      const errorText = await response.text();
      if (errorText.includes('correo')) {
        alert('El correo ya está registrado');
      } else {
        alert('Error al registrar: ' + errorText);
      }
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
    console.error(error);
  }
});
