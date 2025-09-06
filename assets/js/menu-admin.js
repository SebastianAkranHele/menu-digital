// Verifica se o usuário está autenticado
const isLoggedIn = sessionStorage.getItem("isLoggedIn");
if (!isLoggedIn) {
  window.location.href = "login.html";
}

let selectedImage = null;
let imageType = "upload";

// Alterna entre upload e URL
document.getElementById("image-type").addEventListener("change", function() {
  imageType = this.value;
  document.getElementById("upload-group").style.display = imageType === "upload" ? "block" : "none";
  document.getElementById("url-group").style.display = imageType === "url" ? "block" : "none";
});

document.getElementById('product-image').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      selectedImage = event.target.result; // Base64
    };
    reader.readAsDataURL(file);
  }
});

// Abas
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
  });
});

function loadProducts() {
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  const productsList = document.getElementById('products-list');
  
  if (products.length === 0) {
    productsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-wine-bottle"></i>
        <p>Nenhum produto cadastrado ainda.</p>
      </div>
    `;
    return;
  }
  
  productsList.innerHTML = '';
  products.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        ${product.image 
          ? `<img src="${product.image}" alt="${product.name}">` 
          : `<i class="fas fa-wine-bottle" style="font-size: 3rem;"></i>`
        }
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <span class="product-category">${getCategoryName(product.category)}</span>
        <p class="product-price">${product.price} Kz</p>
        <p class="product-desc">${product.description}</p>
        <div class="product-actions">
          <button class="btn btn-sm btn-primary edit-product" data-index="${index}">Editar</button>
          <button class="btn btn-sm btn-danger delete-product" data-index="${index}">Excluir</button>
        </div>
      </div>
    `;
    productsList.appendChild(productCard);
  });

  document.querySelectorAll('.edit-product').forEach(btn => {
    btn.addEventListener('click', () => editProduct(btn.dataset.index));
  });
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.index));
  });
}

function getCategoryName(categoryValue) {
  const categories = {
    'vinhos': 'Vinhos',
    'destilados': 'Destilados',
    'cervejas': 'Cervejas',
    'aperitivos': 'Aperitivos',
    'promocoes': 'Promoções'
  };
  return categories[categoryValue] || categoryValue;
}

document.getElementById('product-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  let finalImage = null;
  if (imageType === "upload") {
    finalImage = selectedImage;
  } else {
    finalImage = document.getElementById("product-image-url").value.trim() || null;
  }

  if (!finalImage) {
    showAlert('Por favor, insira uma imagem (upload ou link).', 'danger');
    return;
  }

  const product = {
    name: document.getElementById('product-name').value,
    price: document.getElementById('product-price').value,
    category: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value,
    image: finalImage
  };

  if (parseFloat(product.price) <= 0) {
    showAlert('Por favor, insira um preço válido.', 'danger');
    return;
  }
  
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  products.push(product);
  localStorage.setItem('garrafeira-products', JSON.stringify(products));
  
  loadProducts();
  this.reset();
  document.getElementById("image-type").value = "upload";
  document.getElementById("upload-group").style.display = "block";
  document.getElementById("url-group").style.display = "none";
  selectedImage = null;

  showAlert('Produto adicionado com sucesso!', 'success');
});

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  const product = products[index];
  
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-description').value = product.description;

  if (product.image && product.image.startsWith("http")) {
    document.getElementById("image-type").value = "url";
    document.getElementById("upload-group").style.display = "none";
    document.getElementById("url-group").style.display = "block";
    document.getElementById("product-image-url").value = product.image;
    selectedImage = null;
  } else {
    document.getElementById("image-type").value = "upload";
    document.getElementById("upload-group").style.display = "block";
    document.getElementById("url-group").style.display = "none";
    selectedImage = product.image || null;
  }
  
  products.splice(index, 1);
  localStorage.setItem('garrafeira-products', JSON.stringify(products));
  
  loadProducts();
  showAlert('Produto carregado para edição.', 'success');
}

function deleteProduct(index) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
    products.splice(index, 1);
    localStorage.setItem('garrafeira-products', JSON.stringify(products));
    loadProducts();
    showAlert('Produto excluído com sucesso!', 'success');
  }
}

function showAlert(message, type) {
  const alertDiv = document.getElementById('form-alert');
  alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => alertDiv.innerHTML = '', 5000);
}

document.addEventListener('DOMContentLoaded', loadProducts);

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
});
