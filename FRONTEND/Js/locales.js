document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo (simularían una API)
    let stores = [
      { id: 1, name: "Starbucks Miraflores", address: "Av. Larco 123", active: true },
      { id: 2, name: "Starbucks San Isidro", address: "Av. Javier Prado 456", active: true },
      { id: 3, name: "Starbucks Centro Histórico", address: "Jr. de la Unión 789", active: false },
      { id: 4, name: "Starbucks La Molina", address: "Av. La Molina 1011", active: true }
    ];
  
    // Elementos DOM
    const statusFilter = document.getElementById('status-filter');
    const refreshBtn = document.getElementById('refresh-btn');
    const storesTable = document.getElementById('stores-table').querySelector('tbody');
    const activeCount = document.getElementById('active-count');
    const inactiveCount = document.getElementById('inactive-count');
  
    // Cargar datos iniciales
    loadStores();
    updateCounters();
  
    // Event Listeners
    statusFilter.addEventListener('change', loadStores);
    refreshBtn.addEventListener('click', () => {
      // Simular recarga de datos
      loadStores();
      showNotification("Locales actualizados correctamente");
    });
  
    // Cargar locales según filtro
    function loadStores() {
      const status = statusFilter.value;
      let filteredStores = [...stores];
  
      if (status !== 'all') {
        filteredStores = stores.filter(store => 
          status === 'active' ? store.active : !store.active
        );
      }
  
      renderStores(filteredStores);
    }
  
    // Renderizar tabla
    function renderStores(storesToRender) {
      storesTable.innerHTML = '';
  
      storesToRender.forEach(store => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${store.id}</td>
          <td>${store.name}</td>
          <td>${store.address}</td>
          <td class="${store.active ? 'status-active' : 'status-inactive'}">
            ${store.active ? 'Activo' : 'Inactivo'}
          </td>
          <td>
            <label class="toggle-switch">
              <input type="checkbox" ${store.active ? 'checked' : ''} data-id="${store.id}">
              <span class="slider"></span>
            </label>
          </td>
        `;
        storesTable.appendChild(row);
      });
  
      // Agregar eventos a los switches
      document.querySelectorAll('.toggle-switch input').forEach(switchEl => {
        switchEl.addEventListener('change', (e) => {
          const storeId = parseInt(e.target.getAttribute('data-id'));
          toggleStoreStatus(storeId, e.target.checked);
        });
      });
    }
  
    // Cambiar estado de local
    function toggleStoreStatus(id, isActive) {
      const storeIndex = stores.findIndex(store => store.id === id);
      if (storeIndex >= 0) {
        stores[storeIndex].active = isActive;
        updateCounters();
        showNotification(`Local ${stores[storeIndex].name} ${isActive ? 'activado' : 'desactivado'}`);
      }
    }
  
    // Actualizar contadores
    function updateCounters() {
      const activeStores = stores.filter(store => store.active).length;
      activeCount.textContent = activeStores;
      inactiveCount.textContent = stores.length - activeStores;
    }
  
    // Mostrar notificación
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  });