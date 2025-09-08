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

  if (!categories.includes('todos')) categories.unshift('todos'); // garante botão "Todos"
  
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
  productsContainer.innerHTML = '';

  let savedProducts = JSON.parse(localStorage.getItem('garrafeira-products')) || [];

  // Skeleton loading
  const skeletonCount = 6;
  for (let i = 0; i < skeletonCount; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'product-card skeleton';
    skeleton.innerHTML = `
      <div class="product-image"></div>
      <div class="product-info">
        <h3 class="product-name">&nbsp;</h3>
        <p class="product-desc">&nbsp;</p>
        <p class="product-price">&nbsp;</p>
      </div>`;
    productsContainer.appendChild(skeleton);
  }

  // Simular atraso de carregamento
  setTimeout(() => {
    const filteredProducts = category === 'todos' 
      ? savedProducts 
      : savedProducts.filter(p => p.category === category);

    productsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="empty-state fade-in">
          <i class="fas fa-wine-bottle"></i>
          <p>Nenhum produto encontrado nesta categoria.</p>
        </div>`;
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card fade-in';
      card.innerHTML = `
        <div class="product-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-wine-bottle" style="font-size:3rem;"></i>`}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <p class="product-price">${product.price}</p>
        </div>`;
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

if (logo && adminLink) {
  adminLink.style.display = 'none'; // inicia escondido
  logo.addEventListener('click', () => {
    clicks++;
    if (clicks === 5) {
      adminLink.style.display = 'flex';
      Swal.fire({
        title: '🔒 Acesso Administrativo Desbloqueado!',
        text: 'Você agora pode acessar o menu administrativo.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#800000',
        color: '#fff',
        confirmButtonColor: '#d4af37'
      });
    } else if (clicks > 0 && clicks < 5) {
      // tooltip temporário mostrando progresso
      const tip = document.createElement('div');
      tip.textContent = `Clique ${5 - clicks}x mais para desbloquear`;
      tip.style.position = 'fixed';
      tip.style.bottom = '120px';
      tip.style.left = '50%';
      tip.style.transform = 'translateX(-50%)';
      tip.style.background = '#800000';
      tip.style.color = '#fff';
      tip.style.padding = '6px 12px';
      tip.style.borderRadius = '12px';
      tip.style.fontSize = '12px';
      tip.style.zIndex = '9999';
      document.body.appendChild(tip);
      setTimeout(() => tip.remove(), 1000);
    }
    setTimeout(() => clicks = 0, 3000); // reseta contador
  });
}

// =======================
// Inicialização
// =======================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  document.addEventListener('touchstart', () => {}, { passive: true }); // melhora mobile
});
