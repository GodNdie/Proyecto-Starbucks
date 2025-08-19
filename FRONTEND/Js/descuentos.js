document.addEventListener('DOMContentLoaded', () => {
    // Base de datos de productos (simulada)
    const products = [
      { id: 1, name: "Café Americano", price: 12.50 },
      { id: 2, name: "Latte", price: 14.00 },
      { id: 3, name: "Cappuccino", price: 14.50 },
      { id: 4, name: "Mocha", price: 15.50 },
      { id: 5, name: "Té Chai", price: 11.00 }
    ];
  
    // Productos con descuento
    let discountedProducts = [];
  
    // Elementos del DOM
    const productSelect = document.getElementById('product-select');
    const discountInput = document.getElementById('discount-percent');
    const applyBtn = document.getElementById('apply-discount');
    const discountTable = document.getElementById('discount-table').querySelector('tbody');
    const totalDiscounted = document.getElementById('total-discounted');
    const totalSavings = document.getElementById('total-savings');
  
    // Llenar select con productos
    function populateProducts() {
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price.toFixed(2)}`;
        productSelect.appendChild(option);
      });
    }
  
    // Aplicar descuento
    function applyDiscount() {
      const productId = parseInt(productSelect.value);
      const discount = parseInt(discountInput.value);
  
      if (!productId || isNaN(discount) || discount <= 0 || discount > 100) {
        alert("Por favor seleccione un producto y un descuento válido (1-100%)");
        return;
      }
  
      const product = products.find(p => p.id === productId);
      const existingIndex = discountedProducts.findIndex(p => p.id === productId);
  
      if (existingIndex >= 0) {
        // Actualizar descuento existente
        discountedProducts[existingIndex].discount = discount;
      } else {
        // Agregar nuevo descuento
        discountedProducts.push({
          ...product,
          discount
        });
      }
  
      updateDiscountTable();
      updateSummary();
      resetForm();
    }
  
    // Actualizar tabla de descuentos
    function updateDiscountTable() {
      discountTable.innerHTML = '';
  
      discountedProducts.forEach(product => {
        const discountedPrice = product.price * (1 - product.discount / 100);
        const savings = product.price - discountedPrice;
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.name}</td>
          <td class="original-price">$${product.price.toFixed(2)}</td>
          <td>${product.discount}%</td>
          <td class="discounted-price">$${discountedPrice.toFixed(2)}</td>
          <td><button class="delete-btn" data-id="${product.id}">Eliminar</button></td>
        `;
        discountTable.appendChild(row);
      });
  
      // Agregar event listeners a los botones de eliminar
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const productId = parseInt(e.target.getAttribute('data-id'));
          removeDiscount(productId);
        });
      });
    }
  
    // Eliminar descuento
    function removeDiscount(productId) {
      discountedProducts = discountedProducts.filter(p => p.id !== productId);
      updateDiscountTable();
      updateSummary();
    }
  
    // Actualizar resumen
    function updateSummary() {
      totalDiscounted.textContent = discountedProducts.length;
      
      const total = discountedProducts.reduce((sum, product) => {
        return sum + (product.price * product.discount / 100);
      }, 0);
      
      totalSavings.textContent = `$${total.toFixed(2)}`;
    }
  
    // Resetear formulario
    function resetForm() {
      productSelect.value = '';
      discountInput.value = '';
    }
  
    // Event Listeners
    applyBtn.addEventListener('click', applyDiscount);
  
    // Inicialización
    populateProducts();
  });