document.getElementById("btnActualizar").addEventListener("click", function() {
  const nombre = document.getElementById("nombre").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const mensaje = document.getElementById("mensaje");

  // Validar campos vacíos
  if (!nombre || !direccion || !telefono) {
    mensaje.textContent = "⚠️ Todos los campos son obligatorios.";
    mensaje.className = "error";
    return;
  }

  // Validar teléfono (solo números y longitud 9)
  const regexTelefono = /^[0-9]{9}$/;
  if (!regexTelefono.test(telefono)) {
    mensaje.textContent = "⚠️ El teléfono debe tener 9 dígitos numéricos.";
    mensaje.className = "error";
    return;
  }

  // Actualizar datos en el perfil
  document.getElementById("nombreActual").textContent = nombre;
  document.getElementById("direccionActual").textContent = direccion;
  document.getElementById("telefonoActual").textContent = telefono;

  // Mostrar mensaje de confirmación
  mensaje.textContent = "✅ Datos actualizados correctamente.";
  mensaje.className = "ok";

  // Limpiar inputs
  document.getElementById("nombre").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("telefono").value = "";
});
