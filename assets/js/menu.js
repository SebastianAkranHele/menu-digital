// =======================
// Elementos do DOM
// =======================
const productsContainer = document.getElementById('products-container');
const categoriesContainer = document.querySelector('.categories');
let activeCategory = 'todos';
let allProducts = [];

const API_BASE = "http://localhost:4000/api"; // Ajuste para o seu backend
const token = sessionStorage.getItem("token"); // Se houver login

// =======================
// Funções de API
// =======================
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Erro ao buscar categorias");
    const data = await res.json();
    return data.map(c => c.name.toLowerCase());
  } catch (err) {
    console.error(err);
    return ["todos"];
  }
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const data = await res.json();
    return data.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category_name.toLowerCase(),
      stock: p.stock,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// =======================
// Renderizar Categorias
// =======================
async function renderCategories() {
  const categories = await fetchCategories();

  if (!categories.includes("todos")) categories.unshift("todos");

  categoriesContainer.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${cat === "todos" ? "active" : ""}`;
    btn.dataset.category = cat;
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoriesContainer.appendChild(btn);
  });

  // Eventos de clique
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.dataset.category;
      renderProducts(activeCategory);
    });
  });
}

// =======================
// Renderizar Produtos
// =======================
async function renderProducts(category = "todos") {
  productsContainer.innerHTML = "";

  // Skeleton loading
  const skeletonCount = 6;
  for (let i = 0; i < skeletonCount; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "product-card skeleton";
    skeleton.innerHTML = `
      <div class="product-image"></div>
      <div class="product-info">
        <h3 class="product-name">&nbsp;</h3>
        <p class="product-desc">&nbsp;</p>
        <p class="product-price">&nbsp;</p>
      </div>`;
    productsContainer.appendChild(skeleton);
  }

  // Busca produtos se ainda não tiver carregado
  if (!allProducts.length) {
    allProducts = await fetchProducts();
  }

  const filteredProducts =
    category === "todos"
      ? allProducts
      : allProducts.filter(p => p.category === category);

  productsContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state fade-in">
        <i class="fas fa-wine-bottle"></i>
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>`;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card fade-in";
    card.innerHTML = `
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-wine-bottle" style="font-size:3rem;"></i>`}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <p class="product-price">${product.price} Kz</p>
      </div>`;
    productsContainer.appendChild(card);
  });
}

// =======================
// Desbloqueio do link admin
// =======================
let clicks = 0;
const logo = document.querySelector('.logo-text');
const adminLink = document.querySelector('.admin-link');

if (logo && adminLink) {
  adminLink.style.display = 'none';
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
    setTimeout(() => clicks = 0, 3000);
  });
}

// =======================
// Inicialização
// =======================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  document.addEventListener('touchstart', () => {}, { passive: true });
});
