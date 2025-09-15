document.addEventListener("DOMContentLoaded", async () => {
  const linksEl = document.getElementById('links');
  const heroEl = document.querySelector(".hero");
  const heroLogoEl = document.getElementById("hero-logo");
  const heroTitleEl = document.getElementById("hero-title");
  const heroSubtitleEl = document.getElementById("hero-subtitle");
  const footerTextEl = document.getElementById("footer-text");
  const footerQrEl = document.getElementById("footer-qr");

  // URL da API - usa a mesma origem em produção
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000' 
    : '';

  const DEFAULT_LINKS = {
    menu:      "menu.html",
    whatsapp:  "https://wa.me/244900000000",
    instagram: "https://instagram.com/minhagarrafeira",
    facebook:  "https://facebook.com/minhagarrafeira"
  };

  const BUTTONS = [
    { key: 'menu',      label: 'Menu Digital', cls: 'is-menu', icon: 'fa-solid fa-book-open' },
    { key: 'whatsapp',  label: 'WhatsApp',     cls: 'is-wa',   icon: 'fa-brands fa-whatsapp' },
    { key: 'instagram', label: 'Instagram',    cls: 'is-ig',   icon: 'fa-brands fa-instagram' },
    { key: 'facebook',  label: 'Facebook',     cls: 'is-fb',   icon: 'fa-brands fa-facebook' }
  ];

  let LINKS = { ...DEFAULT_LINKS };

  // Adicionar classe de loading
  document.body.classList.add('loading');

  // Função para resolver caminhos de imagens
  function resolveImage(pathFromDB) {
    if (!pathFromDB) return "";
    if (pathFromDB.startsWith("http")) return pathFromDB;
    return `${API_URL}${pathFromDB.startsWith("/") ? "" : "/"}${pathFromDB}?t=${Date.now()}`;
  }

  // Função para fallback de imagem
  function handleImageError(img, fallbackSrc = '/assets/img/magaf1.jpg') {
    img.onerror = null;
    img.src = fallbackSrc;
  }

  try {
    const res = await fetch(`${API_URL}/api/public/index`, { 
      cache: "no-cache",
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();

    // Hero background
    if (data.hero_bg && heroEl) {
      const bgUrl = resolveImage(data.hero_bg);
      heroEl.style.backgroundImage = `url('${bgUrl}')`;
    }

    // Hero logo
    if (data.hero_logo && heroLogoEl) {
      heroLogoEl.src = resolveImage(data.hero_logo);
      heroLogoEl.onerror = () => handleImageError(heroLogoEl);
    }

    if (data.hero_title && heroTitleEl) heroTitleEl.textContent = data.hero_title;
    if (data.hero_subtitle && heroSubtitleEl) heroSubtitleEl.textContent = data.hero_subtitle;
    if (data.footer_text && footerTextEl) footerTextEl.textContent = data.footer_text;
    if (data.footer_qr && footerQrEl) footerQrEl.textContent = data.footer_qr;
    
    if (data.buttons) {
      try {
        LINKS = { ...LINKS, ...data.buttons };
      } catch (e) {
        console.error('Erro ao processar botões:', e);
      }
    }

  } catch (err) {
    console.warn("Não foi possível carregar os dados do backend, usando padrão.", err);
    
    // Mostrar mensagem amigável para o usuário
    Swal.fire({
      icon: 'info',
      title: 'Modo offline',
      text: 'Carregando informações padrão',
      timer: 2000,
      showConfirmButton: false
    });
  } finally {
    document.body.classList.remove('loading');
  }

  // Criar botões
  linksEl.innerHTML = "";
  BUTTONS.forEach(({ key, label, cls, icon }) => {
    const href = LINKS[key];
    if (!href) return;

    const a = document.createElement('a');
    a.href = href;
    a.className = `btn ${cls}`;
    a.setAttribute('aria-label', label);
    a.innerHTML = `<span class="ico"><i class="${icon}" aria-hidden="true"></i></span><span>${label}</span>`;

    a.addEventListener('click', e => {
      e.preventDefault();
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${label} será aberto`,
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        background: '#800000',
        color: '#fff'
      });

      setTimeout(() => {
        if (key === 'menu') {
          window.location.href = href;
        } else {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      }, 1300);
    });

    linksEl.appendChild(a);
  });

  // Adicionar fallback para todas as imagens
  document.querySelectorAll('img').forEach(img => {
    if (!img.onerror) {
      img.onerror = function() {
        handleImageError(this);
      };
    }
  });
});