// =======================
// Elementos do DOM
// =======================
const productsContainer = document.getElementById('products-container');
const categoriesContainer = document.querySelector('.categories');
let activeCategory = 'todos';

// =======================
// Renderizar Categorias
// =======================
function renderCategories() {
  let categories = JSON.parse(localStorage.getItem('garrafeira-categories')) || [];

  if(!categories.includes('todos')) categories.unshift('todos'); // garante botão "Todos"
  
  categoriesContainer.innerHTML = ''; // limpa

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${cat === 'todos' ? 'active' : ''}`;
    btn.dataset.category = cat;
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoriesContainer.appendChild(btn);
  });

  // Adiciona eventos
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.dataset.category;
      renderProducts(activeCategory);
    });
  });
}

// =======================
// Renderizar Produtos
// =======================
function renderProducts(category = 'todos') {
  productsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;

  let savedProducts = JSON.parse(localStorage.getItem('garrafeira-products')) || [];

  // Simular atraso de carregamento
  setTimeout(() => {
    const filteredProducts = category === 'todos' 
      ? savedProducts 
      : savedProducts.filter(p => p.category === category);

    if(filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-wine-bottle"></i>
          <p>Nenhum produto encontrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    productsContainer.innerHTML = '';

    filteredProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-wine-bottle" style="font-size:3rem;"></i>`}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <p class="product-price">${product.price}</p>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }, 300);
}

// =======================
// Desbloqueio do link admin
// =======================
let clicks = 0;
const logo = document.querySelector('.logo-text');
const adminLink = document.querySelector('.admin-link');

if(logo && adminLink){
  adminLink.style.display = 'none'; // inicia escondido
  logo.addEventListener('click', () => {
    clicks++;
    if(clicks === 5){
      adminLink.style.display = 'block';
      alert("🔒 Acesso administrativo desbloqueado!");
    }
    setTimeout(() => clicks = 0, 3000);
  });
}

// =======================
// Inicialização
// =======================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  document.addEventListener('touchstart', () => {}, {passive:true}); // melhora mobile
});
