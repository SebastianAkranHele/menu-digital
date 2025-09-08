// =======================
// Configurações iniciais
// =======================
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

let selectedImage = null;
let imageType = "upload";

let editSelectedImage = null;
let editProductIndex = null;
let editImageType = "upload";

// =======================
// Funções de Categoria
// =======================
function loadCategories() {
  let categories = JSON.parse(localStorage.getItem('garrafeira-categories')) || [];

  // Adiciona categorias existentes nos produtos
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  products.forEach(prod => {
    if(prod.category && !categories.includes(prod.category)){
      categories.push(prod.category);
    }
  });

  localStorage.setItem('garrafeira-categories', JSON.stringify(categories));

  // Popula selects
  const categorySelect = document.getElementById('product-category');
  const editCategorySelect = document.getElementById('edit-category');

  categorySelect.innerHTML = `<option value="">Selecione uma categoria</option>`;
  editCategorySelect.innerHTML = '';

  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    editCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  // Lista de categorias em tabela
  const tableBody = document.querySelector('#categories-table tbody');
  if(tableBody){
    tableBody.innerHTML = '';
    categories.forEach((cat, i) => {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = cat;

      const tdActions = document.createElement('td');
      const btn = document.createElement('button');
      btn.textContent = 'Excluir';
      btn.className = 'btn btn-sm btn-danger';
      btn.addEventListener('click', () => deleteCategorySweetAlert(i));
      tdActions.appendChild(btn);

      tr.appendChild(tdName);
      tr.appendChild(tdActions);
      tableBody.appendChild(tr);
    });
  }
}

function addCategory(name) {
  const categories = JSON.parse(localStorage.getItem('garrafeira-categories')) || [];
  if(categories.includes(name)) {
    Swal.fire('Erro', 'Categoria já existe!', 'error');
    return;
  }
  categories.push(name);
  localStorage.setItem('garrafeira-categories', JSON.stringify(categories));
  loadCategories();
  Swal.fire('Sucesso','Categoria adicionada!','success');
}

function deleteCategorySweetAlert(index){
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Deseja excluir esta categoria?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if(result.isConfirmed){
      const categories = JSON.parse(localStorage.getItem('garrafeira-categories')) || [];
      const categoryToDelete = categories[index];

      // Remove produtos dessa categoria
      let products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
      products = products.filter(p => p.category !== categoryToDelete);
      localStorage.setItem('garrafeira-products', JSON.stringify(products));

      // Remove categoria
      categories.splice(index, 1);
      localStorage.setItem('garrafeira-categories', JSON.stringify(categories));

      loadCategories();
      loadProducts();
      Swal.fire('Excluído!', 'Categoria excluída com sucesso.', 'success');
    }
  });
}


// =======================
// Funções de Produto
// =======================
function getCategoryName(value) { return value; }

function loadProducts() {
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  const productsList = document.getElementById('products-list');

  if(products.length === 0){
    productsList.innerHTML = `<div class="empty-state"><i class="fas fa-wine-bottle"></i><p>Nenhum produto cadastrado.</p></div>`;
    return;
  }

  productsList.innerHTML = '';
  products.forEach((product,index)=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-wine-bottle" style="font-size:3rem;"></i>`}</div>
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
    productsList.appendChild(card);
  });

  document.querySelectorAll('.edit-product').forEach(btn=>{
    btn.addEventListener('click', ()=>openEditModal(btn.dataset.index));
  });
  document.querySelectorAll('.delete-product').forEach(btn=>{
    btn.addEventListener('click', ()=>deleteProduct(btn.dataset.index));
  });
}

// =======================
// Modal Adicionar Produto
// =======================
const addModal = document.getElementById('add-product-modal');
const openAddBtn = document.getElementById('open-add-modal');
const closeAddBtn = document.getElementById('close-add-modal');

openAddBtn.addEventListener('click', ()=>{
  document.getElementById('add-product-form').reset();
  document.getElementById('image-type').value = 'upload';
  document.getElementById('upload-group').style.display = 'block';
  document.getElementById('url-group').style.display = 'none';
  selectedImage = null;
  addModal.style.display = 'flex';
});

closeAddBtn.addEventListener('click', ()=>addModal.style.display='none');
window.addEventListener('click', e=>{ if(e.target===addModal) addModal.style.display='none'; });

document.getElementById('image-type').addEventListener('change', function(){
  imageType = this.value;
  document.getElementById('upload-group').style.display = imageType==='upload'?'block':'none';
  document.getElementById('url-group').style.display = imageType==='url'?'block':'none';
});

document.getElementById('product-image').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(event){ selectedImage = event.target.result; };
    reader.readAsDataURL(file);
  }
});

document.getElementById('add-product-form').addEventListener('submit', function(e){
  e.preventDefault();
  const finalImage = imageType==='upload'?selectedImage:document.getElementById('product-image-url').value.trim()||null;
  if(!finalImage) return Swal.fire('Erro','Por favor, insira uma imagem','error');

  const product = {
    name: document.getElementById('product-name').value,
    price: document.getElementById('product-price').value,
    category: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value,
    image: finalImage
  };

  if(parseFloat(product.price)<=0) return Swal.fire('Erro','Preço inválido','error');

  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  products.push(product);
  localStorage.setItem('garrafeira-products',JSON.stringify(products));
  loadProducts();
  this.reset();
  document.getElementById('image-type').value='upload';
  document.getElementById('upload-group').style.display='block';
  document.getElementById('url-group').style.display='none';
  selectedImage=null;
  addModal.style.display='none';
  Swal.fire('Sucesso','Produto adicionado!','success');
});

// =======================
// Edit Modal
// =======================
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('#edit-modal .close-btn');

function openEditModal(index){
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  const product = products[index];

  document.getElementById('edit-product-form').reset();
  editSelectedImage = null;

  document.getElementById('edit-name').value = product.name;
  document.getElementById('edit-price').value = product.price;
  document.getElementById('edit-category').value = product.category;
  document.getElementById('edit-description').value = product.description;

  editSelectedImage = product.image;
  editImageType = product.image && product.image.startsWith('http')?'url':'upload';
  document.getElementById('edit-image-type').value = editImageType;
  document.getElementById('edit-upload-group').style.display = editImageType==='upload'?'block':'none';
  document.getElementById('edit-url-group').style.display = editImageType==='url'?'block':'none';
  if(editImageType==='url') document.getElementById('edit-product-image-url').value = product.image;

  editProductIndex = index;
  editModal.style.display='flex';
}

closeBtn.addEventListener('click', ()=>editModal.style.display='none');
window.addEventListener('click', e=>{ if(e.target===editModal) editModal.style.display='none'; });

document.getElementById('edit-image-type').addEventListener('change', function(){
  editImageType = this.value;
  document.getElementById('edit-upload-group').style.display = editImageType==='upload'?'block':'none';
  document.getElementById('edit-url-group').style.display = editImageType==='url'?'block':'none';
});

document.getElementById('edit-product-image').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(event){ editSelectedImage = event.target.result; };
    reader.readAsDataURL(file);
  }
});

document.getElementById('edit-product-form').addEventListener('submit', function(e){
  e.preventDefault();
  const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
  const product = products[editProductIndex];

  product.name = document.getElementById('edit-name').value;
  product.price = document.getElementById('edit-price').value;
  product.category = document.getElementById('edit-category').value;
  product.description = document.getElementById('edit-description').value;

  const finalImage = editImageType==='upload'?editSelectedImage:document.getElementById('edit-product-image-url').value.trim()||null;
  if(!finalImage) return Swal.fire('Erro','Insira uma imagem','error');
  product.image = finalImage;

  products[editProductIndex] = product;
  localStorage.setItem('garrafeira-products',JSON.stringify(products));
  loadProducts();
  editModal.style.display='none';
  Swal.fire('Sucesso','Produto atualizado!','success');
});

// =======================
// Deletar Produto
// =======================
function deleteProduct(index){
  Swal.fire({
    title:'Tem certeza?',
    text:'Deseja excluir este produto?',
    icon:'warning',
    showCancelButton:true,
    confirmButtonColor:'#d33',
    cancelButtonColor:'#3085d6',
    confirmButtonText:'Sim, excluir!',
    cancelButtonText:'Cancelar'
  }).then(result=>{
    if(result.isConfirmed){
      const products = JSON.parse(localStorage.getItem('garrafeira-products')) || [];
      products.splice(index,1);
      localStorage.setItem('garrafeira-products',JSON.stringify(products));
      loadProducts();
      Swal.fire('Excluído!','Produto excluído com sucesso.','success');
    }
  });
}

// =======================
// Categorias Form
// =======================
document.getElementById('category-form').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('category-name').value.trim();
  if(name === '') return;
  addCategory(name);
  this.reset();
});

// =======================
// Logout
// =======================
document.getElementById('logout-btn').addEventListener('click', ()=>{
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
});

// =======================
// Abas
// =======================
document.querySelectorAll('.nav-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
  });
});

// =======================
// Inicialização
// =======================
document.addEventListener('DOMContentLoaded', ()=>{
  loadCategories();
  loadProducts();

  // Botão Ir para o Menu
  document.getElementById('go-to-menu').addEventListener('click', ()=>{
    window.location.href = 'menu.html';
  });
});
