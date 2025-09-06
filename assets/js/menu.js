// Elementos do DOM
const productsContainer = document.getElementById('products-container');
const categoryButtons = document.querySelectorAll('.category-btn');
let activeCategory = 'todos';

// Função para renderizar produtos
function renderProducts(category = 'todos') {
  // Mostrar estado de carregamento
  productsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
  
  // Carregar produtos do localStorage
  const savedProducts = JSON.parse(localStorage.getItem('garrafeira-products'));
  const products = savedProducts || [
    {
      id: 1,
      name: "Vinho Tinto Reserva",
      description: "Vinho tinto seco, envelhecido em carvalho francês.",
      price: "25.000 Kz",
      category: "vinhos",
      image: "assets/vinho-tinto.jpg"
    },
    {
      id: 2,
      name: "Whisky 12 anos",
      description: "Whisky escocês envelhecido por 12 anos em barris de carvalho.",
      price: "35.000 Kz",
      category: "destilados",
      image: "assets/whisky.jpg"
    },
    {
      id: 3,
      name: "Cerveja Artesanal IPA",
      description: "Cerveja tipo IPA com lúpulo aromático e amargor equilibrado.",
      price: "5.000 Kz",
      category: "cervejas",
      image: "assets/cerveja-ipa.jpg"
    }
  ];
  
  // Salvar produtos padrão se não houver nada
  if (!savedProducts) {
    localStorage.setItem('garrafeira-products', JSON.stringify(products));
  }
  
  // Simular pequeno atraso
  setTimeout(() => {
    const filteredProducts = category === 'todos' 
      ? products 
      : products.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
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
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image">
          ${product.image 
            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : `<i class="fas fa-wine-bottle" style="font-size: 3rem;"></i>`
          }
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <p class="product-price">${product.price}</p>
        </div>
      `;
      productsContainer.appendChild(productCard);
    });
  }, 300);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  
  // Event listeners para categorias
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.dataset.category;
      renderProducts(activeCategory);
    });
  });
});

// Melhorar mobile
document.addEventListener('touchstart', function() {}, {passive: true});

// Desbloquear link administrativo com clique no logo
let clicks = 0;
const logo = document.querySelector('.logo-text');
const adminLink = document.querySelector('.admin-link');

if (logo && adminLink) {
  logo.addEventListener('click', () => {
    clicks++;
    if (clicks === 5) { // 5 cliques no logo
      adminLink.style.display = 'block';
      alert("🔒 Acesso administrativo desbloqueado!");
    }
    // Reset após alguns segundos
    setTimeout(() => clicks = 0, 3000);
  });
}
