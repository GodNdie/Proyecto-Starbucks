// locales.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:8080/api/locales';

  const statusFilter = document.getElementById('status-filter');
  const refreshBtn = document.getElementById('refresh-btn');
  const storesTable = document.querySelector('#stores-table tbody');
  const activeCount = document.getElementById('active-count');
  const inactiveCount = document.getElementById('inactive-count');

  // Carga inicial
  loadStores();

  // Eventos
  statusFilter.addEventListener('change', loadStores);
  refreshBtn.addEventListener('click', () => {
    loadStores();
    showNotification('Locales actualizados correctamente');
  });

  async function loadStores() {
    try {
      const status = statusFilter.value; // all | active | inactive
      const params = new URLSearchParams();

      if (status === 'active') params.set('activo', 'true');
      if (status === 'inactive') params.set('activo', 'false');

      const res = await fetch(`${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`);
      if (!res.ok) throw new Error('Error al cargar locales');

      const locales = await res.json(); // List<LocalDto>
      renderStores(locales);
      updateCounters(locales);
    } catch (err) {
      console.error(err);
      showNotification('No se pudieron cargar los locales', true);
    }
  }

  function renderStores(locales) {
    storesTable.innerHTML = '';

    locales.forEach(l => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${l.id}</td>
        <td>${l.nombre}</td>
        <td>${l.direccion} ${l.ciudad ? `(${l.ciudad})` : ''}</td>
        <td class="${l.activo ? 'status-active' : 'status-inactive'}">
          ${l.activo ? 'Activo' : 'Inactivo'}
        </td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${l.activo ? 'checked' : ''} data-id="${l.id}">
            <span class="slider"></span>
          </label>
        </td>
      `;
      storesTable.appendChild(row);
    });

    // Listeners de switches
    document.querySelectorAll('.toggle-switch input').forEach(switchEl => {
      switchEl.addEventListener('change', async (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        const isActive = e.target.checked;

        // Optimista: actualiza UI de una
        const estadoCell = e.target.closest('tr').children[3];
        estadoCell.textContent = isActive ? 'Activo' : 'Inactivo';
        estadoCell.className = isActive ? 'status-active' : 'status-inactive';

        try {
          const res = await fetch(`${API_BASE}/${id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: isActive })
          });
          if (!res.ok) throw new Error('Error al cambiar estado');
          showNotification(`Local #${id} ${isActive ? 'activado' : 'desactivado'}`);
        } catch (err) {
          // Revertir UI si falla
          e.target.checked = !isActive;
          const revertCell = e.target.closest('tr').children[3];
          revertCell.textContent = !isActive ? 'Activo' : 'Inactivo';
          revertCell.className = !isActive ? 'status-active' : 'status-inactive';
          console.error(err);
          showNotification('No se pudo cambiar el estado', true);
        } finally {
          // Recalcular contadores con una recarga liviana
          await recalcCounters();
        }
      });
    });
  }

  function updateCounters(locales) {
    const activos = locales.filter(l => l.activo).length;
    activeCount.textContent = activos;
    inactiveCount.textContent = locales.length - activos;
  }

  async function recalcCounters() {
    try {
      // Pide todos para contar (si quieres exactitud con filtros “all”)
      const resAll = await fetch(API_BASE);
      if (!resAll.ok) return;
      const all = await resAll.json();
      const activos = all.filter(l => l.activo).length;
      activeCount.textContent = activos;
      inactiveCount.textContent = all.length - activos;
    } catch { /* noop */ }
  }

  function showNotification(message, error = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${error ? 'error' : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
});
