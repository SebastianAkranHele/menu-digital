// Verifica se o usuário está autenticado
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

let selectedImage = null;
let imageType = "upload";
let editIndex = null; // Índice do produto sendo editado

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
          : `<i class="fas fa-wine-bottle" style="font-size: 3rem;"></i>`}
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
    btn.addEventListener('click', () => startEditProduct(btn.dataset.index));
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

// Submit do formulário (adicionar ou salvar edição)
document.getElementById('product-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  let finalImage = imageType === "upload" ? selectedImage : document.getElementById("product-image-url").value.trim() || null;

  if (!finalImage) {
    return Swal.fire('Erro', 'Por favor, insira uma imagem (upload ou link).', 'error');
  }

  const product = {
    name: document.getElementById('product-name').value,
    price: document.getElementById('product-price').value,
    category: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value,
    image: finalImage
  };

  if (parseFloat(product.price) <= 0) {
    return Swal.fire('Erro', 'Por favor, insira um preço válido.', 'error');
  }
  
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];

  if (editIndex !== null) {
    // Atualiza produto existente
    products[editIndex] = product;
    Swal.fire('Sucesso', 'Produto atualizado com sucesso!', 'success');
    editIndex = null;
    document.querySelector('#product-form button').textContent = 'Adicionar Produto';
  } else {
    // Adiciona novo produto
    products.push(product);
    Swal.fire('Sucesso', 'Produto adicionado com sucesso!', 'success');
  }

  localStorage.setItem('garrafeira-products', JSON.stringify(products));
  loadProducts();
  this.reset();
  document.getElementById("image-type").value = "upload";
  document.getElementById("upload-group").style.display = "block";
  document.getElementById("url-group").style.display = "none";
  selectedImage = null;
});

// Iniciar edição
function startEditProduct(index) {
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

  editIndex = index;
  document.querySelector('#product-form button').textContent = 'Salvar Alterações';
  Swal.fire('Editando', 'Edite o produto e clique em "Salvar Alterações".', 'info');
}

// Deletar produto
function deleteProduct(index) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Deseja realmente excluir este produto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
      products.splice(index, 1);
      localStorage.setItem('garrafeira-products', JSON.stringify(products));
      loadProducts();
      Swal.fire('Excluído!', 'Produto excluído com sucesso.', 'success');
    }
  });
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
});

document.addEventListener('DOMContentLoaded', loadProducts);
