// menu-admin.js — Versão consolidada e atualizada

// =======================
// Configurações iniciais
// =======================
const API_BASE = "http://localhost:4000/api";
const token = sessionStorage.getItem("token");

// Proteção segura: redireciona apenas se não houver token
if (!token) {
  window.location.replace("login.html");
  throw new Error("Usuário não logado");
}

// =======================
// Estado local
// =======================
let selectedFile = null;
let imageType = "upload";
let editSelectedFile = null;
let editProductId = null;
let editImageType = "upload";
let editCategoryId = null;
let editHeroBgFile = null;
let editHeroLogoFile = null;

// =======================
// Helpers e utilitários
// =======================
function safeGet(id) {
  return document.getElementById(id) || null;
}

function logError(context, err) {
  console.error(`❌ ${context}:`, err);
}

function showAlert(type, title, text, duration = 2000) {
  if (typeof Swal !== "undefined") {
    Swal.fire({
      icon: type,
      title,
      text,
      timer: duration || undefined,
      showConfirmButton: !duration,
      timerProgressBar: !!duration,
      background: "#800000",
      color: "#fff"
    });
  } else {
    alert(`${title}: ${text}`);
  }
}

// =======================
// Helpers API
// =======================
async function apiGet(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `GET ${url} error`);
  return json;
}

async function apiPost(url, formData) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `POST ${url} error`);
  return json;
}

async function apiPut(url, formData) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `PUT ${url} error`);
  return json;
}

async function apiDelete(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `DELETE ${url} error`);
  return json;
}

// =======================
// Imagens (validação + fallback)
// =======================
function isValidImageUrl(url) {
  if (!url) return false;
  const urlPattern = /^(https?:\/\/|data:image\/|\.?\/)/i;
  if (!urlPattern.test(url)) return false;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  if (url.startsWith("data:image/")) return true;
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

function loadImageWithFallback(imgElement, url, alt) {
  return new Promise(resolve => {
    if (!isValidImageUrl(url)) {
      imgElement.style.display = "none";
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgElement.src = url;
      imgElement.alt = alt || "";
      imgElement.style.display = "block";
      resolve(true);
    };
    img.onerror = () => {
      imgElement.style.display = "none";
      resolve(false);
    };
    img.src = url;
  });
}

// =======================
// Modais
// =======================
function openModal(modal) {
  if (!modal) return;
  modal.style.display = "flex";
}
function closeModal(modal) {
  if (!modal) return;
  modal.style.display = "none";
}

// =======================
// CRUD PÁGINA INICIAL
// =======================
async function loadIndexData() {
  try {
    const data = await apiGet("/index");
    updateIndexPreview(data);

    safeGet("hero-title").value = data.hero_title || "";
    safeGet("hero-subtitle").value = data.hero_subtitle || "";
    safeGet("footer-text").value = data.footer_text || "";
    safeGet("footer-qr").value = data.footer_qr || "";
    safeGet("buttons-json").value = JSON.stringify(data.buttons || {}, null, 2);
  } catch (err) {
    logError("loadIndexData", err);
    showAlert("error", "Erro", err.message || "Erro ao carregar dados da página inicial");
  }
}

function setupIndexForm() {
  const form = safeGet("index-form");
  if (!form) return;

  const heroBgInput = safeGet("hero-bg");
  const heroLogoInput = safeGet("hero-logo");
  const heroBgPreview = safeGet("hero-bg-preview-form");
  const heroLogoPreview = safeGet("hero-logo-preview-form");

  if (heroBgInput && heroBgPreview) {
    heroBgInput.addEventListener("change", e => {
      editHeroBgFile = e.target.files[0];
      if (!editHeroBgFile) {
        heroBgPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        heroBgPreview.src = ev.target.result;
        heroBgPreview.style.display = "block";
      };
      reader.readAsDataURL(editHeroBgFile);
    });
  }

  if (heroLogoInput && heroLogoPreview) {
    heroLogoInput.addEventListener("change", e => {
      editHeroLogoFile = e.target.files[0];
      if (!editHeroLogoFile) {
        heroLogoPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        heroLogoPreview.src = ev.target.result;
        heroLogoPreview.style.display = "block";
      };
      reader.readAsDataURL(editHeroLogoFile);
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("hero_title", safeGet("hero-title")?.value || "");
      fd.append("hero_subtitle", safeGet("hero-subtitle")?.value || "");
      fd.append("footer_text", safeGet("footer-text")?.value || "");
      fd.append("footer_qr", safeGet("footer-qr")?.value || "");

      const buttonsEl = safeGet("buttons-json");
      let buttonsData = {};
      if (buttonsEl && buttonsEl.value.trim()) {
        try {
          buttonsData = JSON.parse(buttonsEl.value);
        } catch {
          buttonsData = {};
        }
      }
      fd.append("buttons", JSON.stringify(buttonsData));

      if (editHeroBgFile) fd.append("hero_bg", editHeroBgFile);
      if (editHeroLogoFile) fd.append("hero_logo", editHeroLogoFile);

      const data = await apiPut("/index", fd);
      showAlert("success", "Sucesso", "Página inicial atualizada", 1400);
      updateIndexPreview(data);

      // Voltar ao preview
      safeGet("index-form").style.display = "none";
      safeGet("index-preview").style.display = "block";
    } catch (err) {
      logError("setupIndexForm submit", err);
      showAlert("error", "Erro", err.message || "Erro ao atualizar página inicial");
    }
  });
}

function updateIndexPreview(data) {
  if (!data) return;

  const heroBg = safeGet("hero-bg-preview");
  if (heroBg && data.hero_bg) {
    heroBg.src = data.hero_bg + "?t=" + Date.now();
    heroBg.style.display = "block";
  } else if (heroBg) {
    heroBg.style.display = "none";
  }

  const heroLogo = safeGet("hero-logo-preview");
  if (heroLogo && data.hero_logo) {
    heroLogo.src = data.hero_logo + "?t=" + Date.now();
    heroLogo.style.display = "block";
  } else if (heroLogo) {
    heroLogo.style.display = "none";
  }

  const heroTitle = safeGet("hero-title-preview");
  if (heroTitle) heroTitle.textContent = data.hero_title || "";

  const heroSubtitle = safeGet("hero-subtitle-preview");
  if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle || "";

  const footerText = safeGet("footer-text-preview");
  if (footerText) footerText.textContent = data.footer_text || "";

  const footerQr = safeGet("footer-qr-preview");
  if (footerQr) footerQr.textContent = data.footer_qr || "";

  const buttonsPreview = safeGet("buttons-json-preview");
  if (buttonsPreview) {
    buttonsPreview.textContent = JSON.stringify(data.buttons || {}, null, 2);
  }
}

function enableIndexEditing() {
  safeGet("index-preview").style.display = "none";
  safeGet("index-form").style.display = "block";
}

// =======================
// CRUD CATEGORIAS
// =======================
async function loadCategories() {
  try {
    const categories = await apiGet("/categories");
    const productSelect = safeGet("product-category");
    const editSelect = safeGet("edit-category");
    const tableBody = document.querySelector("#categories-table tbody");

    if (productSelect) productSelect.innerHTML = `<option value="">Selecione uma categoria</option>`;
    if (editSelect) editSelect.innerHTML = `<option value="">Selecione uma categoria</option>`;
    if (tableBody) tableBody.innerHTML = "";

    (categories || []).forEach(cat => {
      if (productSelect) productSelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
      if (editSelect) editSelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;

      if (tableBody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${cat.name}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-cat">Editar</button>
            <button class="btn btn-sm btn-danger delete-cat">Excluir</button>
          </td>
        `;
        tr.querySelector(".edit-cat")?.addEventListener("click", () => openEditCategory(cat));
        tr.querySelector(".delete-cat")?.addEventListener("click", () => deleteCategory(cat.id));
        tableBody.appendChild(tr);
      }
    });
  } catch (err) {
    logError("loadCategories", err);
    showAlert("error", "Erro", err.message || "Erro ao carregar categorias");
  }
}

async function addCategory(name) {
  try {
    if (!name || !name.trim()) return showAlert("error", "Erro", "Nome inválido");
    const categories = await apiGet("/categories");
    const exists = (categories || []).some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return showAlert("error", "Erro", "Já existe uma categoria com esse nome");

    await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });

    showAlert("success", "Sucesso", "Categoria adicionada", 1500);
    await loadCategories();
    setActiveTab("categories");
  } catch (err) {
    logError("addCategory", err);
    showAlert("error", "Erro", err.message || "Erro ao adicionar categoria");
  }
}

async function editCategorySubmit(id, name) {
  try {
    if (!id) return showAlert("error", "Erro", "Nenhuma categoria selecionada");
    if (!name || !name.trim()) return showAlert("error", "Erro", "Nome inválido");

    await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });

    showAlert("success", "Sucesso", "Categoria atualizada", 1500);
    await loadCategories();
    setActiveTab("categories");
  } catch (err) {
    logError("editCategorySubmit", err);
    showAlert("error", "Erro", err.message || "Erro ao editar categoria");
  }
}

async function deleteCategory(id) {
  try {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Deseja excluir esta categoria? Produtos vinculados não podem ser excluídos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#800000",
      color: "#fff"
    });
    if (!confirm.isConfirmed) return;

    await apiDelete(`/categories/${id}`);
    showAlert("success", "Excluído", "Categoria removida", 1500);
    await loadCategories();
    setActiveTab("categories");
  } catch (err) {
    logError("deleteCategory", err);
    showAlert("error", "Erro", err.message || "Erro ao excluir categoria");
  }
}

function openEditCategory(cat) {
  editCategoryId = cat?.id;
  const editNameEl = safeGet("edit-category-name");
  if (editNameEl) editNameEl.value = cat?.name || "";
  openModal(safeGet("edit-category-modal"));
}

// =======================
// CRUD PRODUTOS
// =======================
async function loadProducts() {
  try {
    const products = await apiGet("/products");
    const list = safeGet("products-list");
    if (!list) return;

    list.innerHTML = "";
    if (!products || products.length === 0) {
      list.innerHTML = "<p>Nenhum produto cadastrado</p>";
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      const categoryName = p.category_name || "Sem categoria";

      card.innerHTML = `
        <div class="product-image">
          <img src="" alt="${p.name}" style="display: none;">
          <i class="fas fa-wine-bottle fallback-icon"></i>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <span class="category">${categoryName}</span>
          <p class="price">${p.price} Kz</p>
          <p class="description">${p.description || ""}</p>
          <div class="product-actions">
            <button class="btn btn-sm btn-primary edit-product">Editar</button>
            <button class="btn btn-sm btn-danger delete-product">Excluir</button>
          </div>
        </div>
      `;

      const imgElement = card.querySelector("img");
      const fallbackIcon = card.querySelector(".fallback-icon");

      if (p.image && isValidImageUrl(p.image)) {
        loadImageWithFallback(imgElement, p.image, p.name).then(success => {
          if (success) fallbackIcon.style.display = "none";
          else { imgElement.style.display = "none"; fallbackIcon.style.display = "block"; }
        });
      } else {
        imgElement.style.display = "none";
        fallbackIcon.style.display = "block";
      }

      const editBtn = card.querySelector(".edit-product");
      const delBtn = card.querySelector(".delete-product");
      editBtn?.addEventListener("click", () => openEditProduct(p.id));
      delBtn?.addEventListener("click", () => deleteProduct(p.id));

      list.appendChild(card);
    });
  } catch (err) {
    logError("loadProducts", err);
    showAlert("error", "Erro", err.message || "Erro ao carregar produtos");
  }
}

async function deleteProduct(id) {
  try {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Deseja excluir este produto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#800000",
      color: "#fff"
    });
    if (!confirm.isConfirmed) return;

    await apiDelete(`/products/${id}`);
    showAlert("success", "Excluído", "Produto removido", 1200);
    await loadProducts();
    setActiveTab("products");
  } catch (err) {
    logError("deleteProduct", err);
    showAlert("error", "Erro", err.message || "Erro ao excluir produto");
  }
}

function openEditProduct(id) {
  editProductId = id;
  apiGet(`/products/${id}`)
    .then(p => {
      const editForm = safeGet("edit-product-form");
      if (editForm) editForm.reset();
      editSelectedFile = null;

      const elName = safeGet("edit-name");
      const elPrice = safeGet("edit-price");
      const elCategory = safeGet("edit-category");
      const elDesc = safeGet("edit-description");
      const elImageUrl = safeGet("edit-product-image-url");
      const elImageType = safeGet("edit-image-type");
      const elUploadGroup = safeGet("edit-upload-group");
      const elUrlGroup = safeGet("edit-url-group");

      if (elName) elName.value = p.name || "";
      if (elPrice) elPrice.value = p.price || "";
      if (elCategory) elCategory.value = p.category_id || "";
      if (elDesc) elDesc.value = p.description || "";

      if (p.image && isValidImageUrl(p.image)) {
        editImageType = "url";
        if (elImageType) elImageType.value = "url";
        if (elUrlGroup) elUrlGroup.style.display = "block";
        if (elUploadGroup) elUploadGroup.style.display = "none";
        if (elImageUrl) elImageUrl.value = p.image || "";
      } else {
        editImageType = "upload";
        if (elImageType) elImageType.value = "upload";
        if (elUploadGroup) elUploadGroup.style.display
                if (elUploadGroup) elUploadGroup.style.display = "block";
        if (elUrlGroup) elUrlGroup.style.display = "none";
        if (elImageUrl) elImageUrl.value = "";
      }

      openModal(safeGet("edit-modal"));
    })
    .catch(err => {
      logError("openEditProduct", err);
      showAlert("error", "Erro", err.message || "Erro ao buscar produto");
    });
}

function setupEditProductForm() {
  const editForm = safeGet("edit-product-form");
  if (!editForm) return;

  // Remove listeners by cloning to avoid duplicates
  const newEditForm = editForm.cloneNode(true);
  editForm.parentNode.replaceChild(newEditForm, editForm);

  newEditForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!editProductId) {
      showAlert("error", "Erro", "Nenhum produto selecionado");
      return;
    }

    try {
      const fd = new FormData();
      const nameEl = safeGet("edit-name");
      const priceEl = safeGet("edit-price");
      const descEl = safeGet("edit-description");
      const categoryEl = safeGet("edit-category");

      if (nameEl) fd.append("name", nameEl.value);
      if (priceEl) fd.append("price", priceEl.value);
      if (descEl) fd.append("description", descEl.value);
      if (categoryEl && categoryEl.value) fd.append("category_id", categoryEl.value);

      if (editImageType === "upload" && editSelectedFile) fd.append("image", editSelectedFile);
      else if (editImageType === "url") {
        const urlEl = safeGet("edit-product-image-url");
        if (urlEl && urlEl.value.trim()) fd.append("image", urlEl.value.trim());
      }

      await apiPut(`/products/${editProductId}`, fd);
      showAlert("success", "Sucesso", "Produto atualizado com sucesso", 1400);
      closeModal(safeGet("edit-modal"));
      await loadProducts();
    } catch (err) {
      logError("setupEditProductForm submit", err);
      showAlert("error", "Erro", err.message || "Erro ao atualizar produto");
    }
  });
}

// =======================
// Preview de imagens (upload + url)
// =======================
function previewImage(fileInput, urlInput, previewElement) {
  if (fileInput) {
    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          previewElement.src = ev.target.result;
          previewElement.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        previewElement.style.display = "none";
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener("input", e => {
      const url = e.target.value.trim();
      if (isValidImageUrl(url)) {
        previewElement.src = url;
        previewElement.style.display = "block";
      } else {
        previewElement.style.display = "none";
      }
    });
  }
}

// =======================
// Abas, logout e navegação
// =======================
function setActiveTab(tabName) {
  try {
    document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => {
      c.classList.remove("active");
      c.style.display = "none";
    });

    const tabBtn = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
    const tabContent = safeGet(`${tabName}-tab`);

    if (tabBtn) tabBtn.classList.add("active");
    if (tabContent) {
      tabContent.classList.add("active");
      tabContent.style.display = "block";
    }

    if (tabName === "index") {
      loadIndexData();
      // Sempre mostrar preview e esconder form na aba index
      safeGet("index-preview").style.display = "block";
      safeGet("index-form").style.display = "none";
    }

    localStorage.setItem("activeTab", tabName);
  } catch (err) {
    logError("setActiveTab", err);
  }
}

// =======================
// Attach listeners (após DOM pronto)
// =======================
function attachListeners() {
  // Modais: fechar ao clicar fora / botões
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); });
    const closeBtn = modal.querySelector(".close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
  });

  // Categoria: forms
  const categoryForm = safeGet("category-form");
  if (categoryForm) {
    categoryForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = (safeGet("category-name")?.value || "").trim();
      if (!name) return showAlert("error", "Erro", "Digite um nome válido");
      addCategory(name);
      categoryForm.reset();
    });
  }

  const editCategoryForm = safeGet("edit-category-form");
  if (editCategoryForm) {
    editCategoryForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = (safeGet("edit-category-name")?.value || "").trim();
      if (!name) return showAlert("error", "Erro", "Nome inválido");
      editCategorySubmit(editCategoryId, name);
      closeModal(safeGet("edit-category-modal"));
    });
  }

  // Produtos: abrir modal (garantir categorias atualizadas)
  const openAddBtn = safeGet("open-add-modal");
  if (openAddBtn) {
    openAddBtn.addEventListener("click", async () => {
      await loadCategories();
      const addForm = safeGet("add-product-form");
      addForm?.reset();
      selectedFile = null;
      const imageTypeEl = safeGet("image-type");
      if (imageTypeEl) imageTypeEl.value = "upload";
      safeGet("upload-group") && (safeGet("upload-group").style.display = "block");
      safeGet("url-group") && (safeGet("url-group").style.display = "none");
      openModal(safeGet("add-product-modal"));
    });
  }

  const imageTypeEl = safeGet("image-type");
  if (imageTypeEl) {
    imageTypeEl.addEventListener("change", function () {
      imageType = this.value;
      const uploadGroup = safeGet("upload-group");
      const urlGroup = safeGet("url-group");
      if (uploadGroup) uploadGroup.style.display = imageType === "upload" ? "block" : "none";
      if (urlGroup) urlGroup.style.display = imageType === "url" ? "block" : "none";

      // Remover required quando escondido
      if (imageType === "upload") safeGet("product-image-url")?.removeAttribute("required");
      else safeGet("product-image")?.removeAttribute("required");
    });
  }

  const productImageEl = safeGet("product-image");
  if (productImageEl) productImageEl.addEventListener("change", e => (selectedFile = e.target.files[0]));

  const addProductForm = safeGet("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async e => {
      e.preventDefault();
      try {
        const form = e.target;
        const fd = new FormData();
        fd.append("name", form["product-name"].value);
        fd.append("price", form["product-price"].value);
        fd.append("description", form["product-description"].value);
        if (form["product-category"].value) fd.append("category_id", form["product-category"].value);

        if (imageType === "upload") {
          if (!selectedFile) return showAlert("error", "Erro", "Selecione uma imagem");
          fd.append("image", selectedFile);
        } else if (form["product-image-url"].value.trim() !== "") {
          fd.append("image", form["product-image-url"].value.trim());
        }

        await apiPost("/products", fd);
        showAlert("success", "Sucesso", "Produto adicionado", 1400);
        closeModal(safeGet("add-product-modal"));
        await loadProducts();
        setActiveTab("products");
      } catch (err) {
        logError("addProductForm submit", err);
        showAlert("error", "Erro", err.message || "Erro ao adicionar produto");
      }
    });
  }

  // Edit product listeners
  const editImageTypeEl = safeGet("edit-image-type");
  if (editImageTypeEl) {
    editImageTypeEl.addEventListener("change", function () {
      editImageType = this.value;
      const uploadGroup = safeGet("edit-upload-group");
      const urlGroup = safeGet("edit-url-group");
      if (uploadGroup) uploadGroup.style.display = editImageType === "upload" ? "block" : "none";
      if (urlGroup) urlGroup.style.display = editImageType === "url" ? "block" : "none";

      if (editImageType === "upload") safeGet("edit-product-image-url")?.removeAttribute("required");
      else safeGet("edit-product-image")?.removeAttribute("required");
    });
  }

  const editProductImageEl = safeGet("edit-product-image");
  if (editProductImageEl) editProductImageEl.addEventListener("change", e => { editSelectedFile = e.target.files[0]; });

  setupEditProductForm();

  // Abas (nav tabs)
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });

  // Logout
  const logoutBtn = safeGet("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Sair da conta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Cancelar",
        background: "#800000",
        color: "#fff"
      }).then(result => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("token");
          window.location.href = "login.html";
        }
      });
    });
  }

  // Go to menu
  const goToMenu = safeGet("go-to-menu");
  if (goToMenu) goToMenu.addEventListener("click", () => { window.location.href = "menu.html"; });

  // Pré-visualização: try to attach if elements exist
  const fileInput = safeGet("product-image");
  const urlInput = safeGet("product-image-url");
  const previewEl = safeGet("product-preview");
  if (previewEl && (fileInput || urlInput)) previewImage(fileInput, urlInput, previewEl);

  const editFileInput = safeGet("edit-product-image");
  const editUrlInput = safeGet("edit-product-image-url");
  const editPreviewEl = safeGet("edit-product-preview");
  if (editPreviewEl && (editFileInput || editUrlInput)) previewImage(editFileInput, editUrlInput, editPreviewEl);

  // Configurar formulário da página inicial
  setupIndexForm();

  // Botões para editar e cancelar edição da página inicial
  const editIndexBtn = safeGet("edit-index-btn");
  if (editIndexBtn) {
    editIndexBtn.addEventListener("click", () => enableIndexEditing());
  }
  const cancelIndexBtn = safeGet("cancel-edit-index");
  if (cancelIndexBtn) {
    cancelIndexBtn.addEventListener("click", () => {
      safeGet("index-form").style.display = "none";
      safeGet("index-preview").style.display = "block";
    });
  }
}

// =======================
// Inicialização (quando DOM pronto)
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    attachListeners();

    // Remove required attributes se não houver elementos
    ["product-image","product-image-url","edit-product-image","edit-product-image-url"].forEach(id => {
      safeGet(id)?.removeAttribute("required");
    });

    // Carregar dados iniciais somente se os containers existirem
    if (safeGet("product-category") || safeGet("categories-table")) await loadCategories();
    if (safeGet("products-list")) await loadProducts();

    // Abas - carregar aba salva ou padrão
    const savedTab = localStorage.getItem("activeTab") || "categories";
    setActiveTab(savedTab);

    console.log("✅ menu-admin inicializado");
  } catch (err) {
    logError("DOMContentLoaded init", err);
  }
});
