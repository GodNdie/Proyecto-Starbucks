// ../js/carrito.js
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("carrito-list");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnConfirmar = document.getElementById("confirmar-compra");
  const token = localStorage.getItem("token");

  const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];
  const setCarrito = (arr) => localStorage.setItem("carrito", JSON.stringify(arr));

  function render() {
    const carrito = getCarrito();
    if (carrito.length === 0) {
      listEl.innerHTML = "<p>No tienes artículos en el carrito.</p>";
      return;
    }

    listEl.innerHTML = carrito
      .map((item, idx) => {
        const d = item.display || {};
        const idMostrar =
          item.backend?.cafeId ??
          d.cafeId ??
          item.cafeId ??
          item.idCafe ??
          "-";

        const adic = Array.isArray(d.adicionales)
          ? d.adicionales.join(", ")
          : (d.adicionales || "Ninguno");

        return `
        <div class="cart-item" data-idx="${idx}">
          <h3>Bebida (ID ${idMostrar})</h3>
          <p><strong>Cantidad:</strong> ${d.cantidad ?? item.backend?.cantidad ?? 1}</p>
          <p><strong>Leche:</strong> ${d.leche ?? "-"}</p>
          <p><strong>Temperatura:</strong> ${d.temperatura ?? item.backend?.temperatura ?? "-"}</p>
          <p><strong>Crema batida:</strong> ${d.cremaBatida ?? "-"}</p>
          <p><strong>Adicionales:</strong> ${adic}</p>
          <div class="cart-actions">
            <button class="btn-outline btn-eliminar">Eliminar</button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // Eliminar item
  listEl.addEventListener("click", (e) => {
    const rem = e.target.closest(".btn-eliminar");
    if (!rem) return;
    const itemDiv = rem.closest(".cart-item");
    const idx = Number(itemDiv.getAttribute("data-idx"));
    const carrito = getCarrito();
    carrito.splice(idx, 1);
    setCarrito(carrito);
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
      const carrito = getCarrito();
      if (carrito.length === 0) return alert("No hay items para comprar.");

      if (!token) {
        alert("Debes iniciar sesión para confirmar la compra.");
        window.location.href = "login.html";
        return;
      }

      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Procesando...";

      try {
        for (const item of carrito) {
          const d = item.display || {};
          const b = item.backend || {};

          // 1) Obtener y validar cafeId
          let cafeId =
            b.cafeId ??
            d.cafeId ??
            item.cafeId ??
            item.idCafe;

          cafeId = cafeId != null ? Number(cafeId) : null;

          if (!cafeId || Number.isNaN(cafeId)) {
            console.error("Item inválido, falta cafeId:", { item, d, b });
            alert("Error: falta el ID del café en el carrito. Vuelve a agregar el producto.");
            throw new Error("cafeId missing");
          }

          // 2) Otros campos que sí soporta tu DTO
          const temperatura = b.temperatura ?? d.temperatura ?? "tibio";

          // personalizacionesIds: intenta derivar de varias estructuras
          let personalizacionesIds = [];
          if (Array.isArray(b.personalizacionesIds)) {
            personalizacionesIds = b.personalizacionesIds;
          } else if (Array.isArray(b.personalizacionesId)) {
            personalizacionesIds = b.personalizacionesId; // por si antes lo guardaste en singular
          } else if (Array.isArray(item.adicionalesIds)) {
            personalizacionesIds = item.adicionalesIds;
          } else if (Array.isArray(d.adicionalesIds)) {
            personalizacionesIds = d.adicionalesIds;
          } else if (Array.isArray(b.personalizaciones)) {
            personalizacionesIds = b.personalizaciones.map(x => x?.id).filter(Boolean);
          } else if (Array.isArray(d.adicionales) && typeof d.adicionales[0] === "object") {
            personalizacionesIds = d.adicionales.map(a => a?.id).filter(Boolean);
          }

          // ingredientesIds: si no los manejas aún, envía []
          let ingredientesIds = [];
          if (Array.isArray(b.ingredientesIds)) {
            ingredientesIds = b.ingredientesIds;
          } else if (Array.isArray(item.ingredientesIds)) {
            ingredientesIds = item.ingredientesIds;
          } else if (Array.isArray(d.ingredientesIds)) {
            ingredientesIds = d.ingredientesIds;
          }

          // 3) Construir body EXACTO para tu DTO PedidoRequest
          const body = {
            cafeId,
            temperatura,
            personalizacionesIds,
            ingredientesIds
            // localId: b.localId ?? null,
            // metodoPagoId: b.metodoPagoId ?? null
            // OJO: tu DTO no tiene 'cantidad'. Si la quieres, agrégala al DTO
          };

          console.log("POST /api/pedidos body:", JSON.stringify(body));

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
        carrito.forEach(item => historial.push({ ...(item.display || {}), fecha }));
        localStorage.setItem("historialPedidos", JSON.stringify(historial));

        // Guardar último pedido para el modal
        localStorage.setItem("pedidoActual", JSON.stringify((carrito[carrito.length - 1].display) || {}));

        // Mostrar modal y vaciar
        mostrarModalConfirmacion();
        localStorage.removeItem("carrito");
        render();

      } catch (err) {
        console.error(err);
        alert("Error al procesar la compra: " + (err.message || err));
      } finally {
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar Compra";
      }
    });
  }

  // Modal
  function mostrarModalConfirmacion() {
    const modal = document.getElementById("modal-confirmacion");
    const listaResumen = document.getElementById("lista-resumen");
    if (!modal || !listaResumen) return;

    const pedido = JSON.parse(localStorage.getItem("pedidoActual")) || {};

    const extrasText = Array.isArray(pedido.adicionales)
      ? pedido.adicionales.join(", ")
      : (pedido.adicionales || "Ninguno");

    listaResumen.innerHTML = `
      <li><strong>Bebida:</strong> ${pedido.cafeId || "No especificado"}</li>
      <li><strong>Leche:</strong> ${pedido.leche || "No especificado"}</li>
      <li><strong>Temperatura:</strong> ${pedido.temperatura || "No especificado"}</li>
      <li><strong>Extras:</strong> ${extrasText}</li>
      <li><strong>Cantidad:</strong> ${pedido.cantidad || 1}</li>
    `;

    modal.style.display = "block";
  }

  const btnCerrarModal = document.getElementById("cerrar-modal");
  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
      const modal = document.getElementById("modal-confirmacion");
      if (modal) modal.style.display = "none";
    });
  }

  const btnSeguir = document.getElementById("seguir-comprando");
  if (btnSeguir) btnSeguir.addEventListener("click", () => (window.location.href = "index.html"));

  const btnVer = document.getElementById("ver-pedidos");
  if (btnVer) btnVer.addEventListener("click", () => (window.location.href = "historial.html"));

  window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-confirmacion");
    if (modal && e.target === modal) modal.style.display = "none";
  });

  render();
});
