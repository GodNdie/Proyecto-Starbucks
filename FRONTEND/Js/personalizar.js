// ../js/personalizar.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const cafeId = parseInt(params.get("cafeId")) || null;
  const token = localStorage.getItem("token");

  // Guarda los datos de personalizaciones traídos del backend
  let personalizacionesGlobal = {};

  // Referencias DOM
  const selectLeche = document.getElementById("tipo-leche");
  const selectTemp = document.getElementById("temperatura");
  const selectCrema = document.getElementById("crema-batida");
  const cantidadInput = document.getElementById("cantidad");

  const inputCombo = document.getElementById("adicionales-input");
  const optionsContainer = document.getElementById("combo-options");
  const tagsContainer = document.getElementById("selected-tags");

  // Lista de adicionales seleccionados (strings)
  let seleccionados = [];

  // Función para rellenar selects con valores estáticos (fallback)
  function rellenarDefaults() {
    if (selectLeche) {
      // dejar placeholder y añadir valores
      const opciones = ["Leche entera","Leche descremada","Leche de soya","Leche de almendra","Leche de avena","Sin leche"];
      opciones.forEach(v => {
        const opt = document.createElement("option"); opt.value = v; opt.textContent = v;
        selectLeche.appendChild(opt);
      });
    }
    if (selectTemp) {
      const opciones = ["Caliente","Tibio","Iced"];
      opciones.forEach(v => {
        const opt = document.createElement("option"); opt.value = v; opt.textContent = v;
        selectTemp.appendChild(opt);
      });
    }
    if (optionsContainer) {
      const extras = ["Canela","Chispas de chocolate","Vainilla","Caramelo","Nuez Moscada"];
      extras.forEach(v => {
        const d = document.createElement("div");
        d.setAttribute("data-value", v);
        d.textContent = v;
        optionsContainer.appendChild(d);
      });
    }
  }

  // ---- 1) CARGAR PERSONALIZACIONES DESDE BACKEND (si está disponible) ----
  try {
    const res = await fetch("http://localhost:8080/api/personalizaciones");
    if (!res.ok) throw new Error("No se pudo obtener personalizaciones (status " + res.status + ")");
    const data = await res.json();
    personalizacionesGlobal = data;
    console.log("personalizaciones cargadas:", data);

    // Poblar selects (limpia antes manteniendo placeholder)
    function poblarSelectFromData(tipo, selectEl) {
      if (!data[tipo] || !selectEl) return;
      // elimina todas las opciones que no están marcadas disabled (placeholder sigue si existe)
      selectEl.querySelectorAll("option:not([disabled])").forEach(o => o.remove());
      data[tipo].forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.valor;
        opt.textContent = p.valor;
        selectEl.appendChild(opt);
      });
    }

    poblarSelectFromData("leche", selectLeche);
    poblarSelectFromData("temperatura", selectTemp);

    // Llenar container de adicionales desde extra/endulzante/hielo (si existen)
    if (optionsContainer) {
      optionsContainer.innerHTML = "";
      ["extra","endulzante","hielo"].forEach(tipo => {
        if (!data[tipo]) return;
        data[tipo].forEach(p => {
          const div = document.createElement("div");
          div.setAttribute("data-value", p.valor);
          div.textContent = p.valor;
          optionsContainer.appendChild(div);
        });
      });
      // Si no hubo nada, el HTML previa puede tener elementos estáticos (no sobreescribimos más)
    }
  } catch (err) {
    console.warn("No se pudieron cargar las personalizaciones desde el backend:", err);
    // fallback a valores estáticos para que la UI funcione localmente
    rellenarDefaults();
  }

  // ---- 2) COMBOBOX ADICIONALES (apertura, selección y tags) ----

  // mostrar conteo en el input
  function updateComboInput() {
    if (!inputCombo) return;
    if (seleccionados.length === 0) {
      inputCombo.value = "";
      inputCombo.placeholder = "Selecciona adicionales...";
    } else {
      inputCombo.value = seleccionados.join(", ");
    }
  }

  // renderizar tags (FÍJATE: usamos BACKTICKS correctamente)
  function renderTags() {
    if (!tagsContainer) return;
    tagsContainer.innerHTML = "";
    seleccionados.forEach(item => {
      const tag = document.createElement("div");
      tag.className = "tag";
      // estructura: texto + botón para quitar
      tag.innerHTML = `<span class="tag-text">${item}</span><button type="button" class="tag-remove" data-value="${item}" aria-label="Eliminar ${item}">×</button>`;
      tagsContainer.appendChild(tag);
    });
    updateComboInput();
  }

  // toggle dropdown
  if (inputCombo) {
    inputCombo.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!optionsContainer) return;
      optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
    });
  }

  // delegación: clic en una opción
  if (optionsContainer) {
    optionsContainer.addEventListener("click", (e) => {
      const optionDiv = e.target.closest("[data-value]");
      if (!optionDiv) return;
      const value = optionDiv.getAttribute("data-value");
      if (!seleccionados.includes(value) && seleccionados.length < 5) {
        seleccionados.push(value);
        renderTags();
      }
      // ocultar menú (como UX)
      optionsContainer.style.display = "none";
    });
  }

  // delegación: quitar tag
  if (tagsContainer) {
    tagsContainer.addEventListener("click", (e) => {
      const rem = e.target.closest(".tag-remove");
      if (!rem) return;
      const val = rem.getAttribute("data-value");
      seleccionados = seleccionados.filter(x => x !== val);
      renderTags();
    });
  }

  // cerrar si clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".combo-container")) {
      if (optionsContainer) optionsContainer.style.display = "none";
    }
  });

  // ---- 3) CONTROL DE CANTIDAD (+ / -) ----
  const btnsCantidad = document.querySelectorAll(".cantidad-control button");
  const btnMinus = btnsCantidad && btnsCantidad[0];
  const btnPlus = btnsCantidad && btnsCantidad[1];

  // función global para que onclick inline funcione: window.modificarCantidad(...)
  window.modificarCantidad = function (cambio) {
    const input = document.getElementById("cantidad");
    let valor = parseInt(input.value) || 1;
    valor = valor + cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
    updateCantidadButtons();
  };

  // listeners también (por si no quieres inline)
  if (btnMinus) btnMinus.addEventListener("click", () => window.modificarCantidad(-1));
  if (btnPlus) btnPlus.addEventListener("click", () => window.modificarCantidad(1));

  function updateCantidadButtons() {
    const v = parseInt(cantidadInput.value) || 1;
    if (btnMinus) btnMinus.disabled = v <= 1;
  }

  // inicializar estado botones
  updateCantidadButtons();

  // si el usuario escribe manualmente
  if (cantidadInput) cantidadInput.addEventListener("input", updateCantidadButtons);

  // ---- 4) SUBMIT: crear objeto pedido, mapear personalizaciones a IDs, guardar carrito y redirigir ----
  const form = document.getElementById("personalizarForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // validar selects mínimos
      const leche = (selectLeche && selectLeche.value) || "";
      const temperatura = (selectTemp && selectTemp.value) || "";
      const cremaUi = (selectCrema && selectCrema.value) || ""; // 'si' | 'no'
      const cantidad = parseInt(cantidadInput.value) || 1;

      if (!leche || !temperatura) {
        return alert("Por favor, selecciona tipo de leche y temperatura.");
      }

      // preparar lista final de adicionales (incluimos crema si eligió 'si')
      const adicionalesDisplay = [...seleccionados]; // strings
      if (cremaUi.toLowerCase() === "si" || cremaUi.toLowerCase() === "sí") {
        // usamos exactamente el valor que tienes en la BD: "Crema batida"
        adicionalesDisplay.push("Crema batida");
      }

      // calcular personalizacionesId (si tenemos personalizacionesGlobal)
      // personalizacionesGlobal espera estructura { leche: [...], temperatura: [...], extra: [...], ... }
      let personalizacionesId = [];
      try {
        const all = Object.values(personalizacionesGlobal).flat();
        const valoresABuscar = [leche, ...adicionalesDisplay];
        personalizacionesId = all
          .filter(p => valoresABuscar.includes(p.valor))
          .map(p => p.id);
      } catch (err) {
        personalizacionesId = []; // si algo falla, dejamos vacío
      }

      // Crear objetos para display y para backend
      const pedidoDisplay = {
        cafeId: cafeId,
        cantidad,
        leche,
        temperatura,
        cremaBatida: (cremaUi.toLowerCase() === "si" || cremaUi.toLowerCase() === "sí") ? "Sí" : "No",
        adicionales: adicionalesDisplay
      };

      const pedidoBackend = {
        cafeId,
        cantidad,
        temperatura,
        personalizacionesId
      };

      // Guardamos en localStorage en array 'carrito' (para múltiples items)
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push({ display: pedidoDisplay, backend: pedidoBackend });
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Redirigir a carrito
      window.location.href = "carrito.html";
    });
  }
}); // end DOMContentLoaded