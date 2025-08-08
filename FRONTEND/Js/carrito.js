// ../js/carrito.js
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("carrito-list");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnConfirmar = document.getElementById("confirmar-compra");
  const token = localStorage.getItem("token");

  function render() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
      listEl.innerHTML = "<p>No tienes artículos en el carrito.</p>";
      return;
    }

    listEl.innerHTML = carrito.map((item, idx) => {
      const d = item.display || {};
      const adicionales = d.adicionales && d.adicionales.length ? d.adicionales.join(", ") : "Ninguno";
      return `
        <div class="cart-item" data-idx="${idx}">
          <h3>Bebida (ID ${d.cafeId || "-"})</h3>
          <p><strong>Cantidad:</strong> ${d.cantidad}</p>
          <p><strong>Leche:</strong> ${d.leche}</p>
          <p><strong>Temperatura:</strong> ${d.temperatura}</p>
          <p><strong>Crema batida:</strong> ${d.cremaBatida}</p>
          <p><strong>Adicionales:</strong> ${adicionales}</p>
          <div class="cart-actions">
            <button class="btn-outline btn-eliminar">Eliminar</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Eliminar item
  listEl.addEventListener("click", (e) => {
    const rem = e.target.closest(".btn-eliminar");
    if (!rem) return;
    const itemDiv = rem.closest(".cart-item");
    const idx = Number(itemDiv.getAttribute("data-idx"));
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(idx, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    render();
  });

  // Vaciar carrito
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (!confirm("¿Vaciar todo el carrito?")) return;
      localStorage.removeItem("carrito");
      render();
    });
  }

  // Confirmar compra
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", async () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) return alert("No hay items para comprar.");

      if (!token) {
        alert("Debes iniciar sesión para confirmar la compra.");
        window.location.href = "login.html";
        return;
      }

      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Procesando...";

      try {
        // Enviar cada pedido al backend
        for (const item of carrito) {
          const payload = item.backend || {};
          const body = {
            cafeId: payload.cafeId,
            cantidad: payload.cantidad,
            temperatura: payload.temperatura,
            personalizacionesId: payload.personalizacionesId || []
          };

          const res = await fetch("http://localhost:8080/api/pedidos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error("Error en pedido: " + text);
          }
        }

        // Guardar historial
        const historial = JSON.parse(localStorage.getItem("historialPedidos")) || [];
        const fecha = new Date().toLocaleString();
        carrito.forEach(item => historial.push({ ...item.display, fecha }));
        localStorage.setItem("historialPedidos", JSON.stringify(historial));

        // Guardar último pedido para el modal
        localStorage.setItem("pedidoActual", JSON.stringify(carrito[carrito.length - 1].display));

        // Mostrar modal
        mostrarModalConfirmacion();

        // Vaciar carrito
        localStorage.removeItem("carrito");

      } catch (err) {
        console.error(err);
        alert("Error al procesar la compra: " + (err.message || err));
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar Compra";
      }
    });
  }

  // Mostrar modal de confirmación
  function mostrarModalConfirmacion() {
    const modal = document.getElementById("modal-confirmacion");
    const listaResumen = document.getElementById("lista-resumen");

    const pedido = JSON.parse(localStorage.getItem("pedidoActual")) || {};

    listaResumen.innerHTML = `
      <li><strong>Bebida:</strong> ${pedido.cafeId || "No especificado"}</li>
      <li><strong>Leche:</strong> ${pedido.leche || "No especificado"}</li>
      <li><strong>Temperatura:</strong> ${pedido.temperatura || "No especificado"}</li>
      <li><strong>Extras:</strong> ${(pedido.adicionales && pedido.adicionales.join(", ")) || "Ninguno"}</li>
      <li><strong>Cantidad:</strong> ${pedido.cantidad || 1}</li>
    `;

    modal.style.display = "block";
  }

  // Cerrar modal
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-confirmacion").style.display = "none";
  });

  // Botones del modal
  document.getElementById("seguir-comprando").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("ver-pedidos").addEventListener("click", () => {
    window.location.href = "historial.html";
  });

  // Cerrar modal si clic fuera
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-confirmacion");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Render inicial
  render();
});
