// archivo: Js/filtro_pedidos.js

document.addEventListener("DOMContentLoaded", function () {
    const inputInicio = document.getElementById("fechaInicio");
    const inputFin = document.getElementById("fechaFin");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const listaPedidos = document.getElementById("listaPedidos");
    const mensaje = document.getElementById("mensaje");

    // Datos de ejemplo (en un caso real esto vendría del backend)
    const pedidos = [
        
        { id: 1, fecha: "2025-08-18", detalle: "latte" }
    ];

    btnFiltrar.addEventListener("click", function () {
        const inicio = new Date(inputInicio.value);
        const fin = new Date(inputFin.value);

        // Validación simple
        if (!inputInicio.value || !inputFin.value) {
            mensaje.textContent = "⚠️ Selecciona ambas fechas.";
            listaPedidos.innerHTML = "";
            return;
        }

        // Filtrar pedidos en el rango
        const resultados = pedidos.filter(p => {
            const fechaPedido = new Date(p.fecha);
            return fechaPedido >= inicio && fechaPedido <= fin;
        });

        if (resultados.length === 0) {
            mensaje.textContent = "No se encontraron pedidos en este rango.";
            listaPedidos.innerHTML = "";
        } else {
            mensaje.textContent = "";
            listaPedidos.innerHTML = resultados.map(p => 
                `<li>🛒 Pedido #${p.id} - ${p.detalle} (${p.fecha})</li>`
            ).join("");
        }
    });
});
