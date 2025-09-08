// ===== CONFIGURAÇÃO RÁPIDA =====
const LINKS = {
  menu:      "menu.html",
  whatsapp:  "https://wa.me/244900000000",
  maps:      "https://maps.google.com/?q=Garrafeira%20XYZ",
  instagram: "https://instagram.com/minhagarrafeira",
  facebook:  "https://facebook.com/minhagarrafeira",
  tiktok:    "https://tiktok.com/@minhagarrafeira",
  phone:     "tel:+244900000000",
  site:      "https://meusite.com"
};

const BUTTONS = [
  { key: 'menu',     label: 'Menu Digital',   cls: 'is-menu',   icon: 'fa-solid fa-book-open' },
  { key: 'whatsapp', label: 'WhatsApp',       cls: 'is-wa',     icon: 'fa-brands fa-whatsapp' },
  { key: 'maps',     label: 'Localização',    cls: 'is-maps',   icon: 'fa-solid fa-location-dot' },
  { key: 'instagram',label: 'Instagram',      cls: 'is-ig',     icon: 'fa-brands fa-instagram' },
  { key: 'facebook', label: 'Facebook',       cls: 'is-fb',     icon: 'fa-brands fa-facebook' },
  { key: 'tiktok',   label: 'TikTok',         cls: 'is-tt',     icon: 'fa-brands fa-tiktok' },
  { key: 'phone',    label: 'Contacto',       cls: 'is-phone',  icon: 'fa-solid fa-phone', badge: 'liga' },
  { key: 'site',     label: 'Site',           cls: 'is-site',   icon: 'fa-solid fa-globe' }
];

const linksEl = document.getElementById('links');

BUTTONS.forEach(({key, label, cls, icon, badge}) => {
  const href = LINKS[key];
  if (!href) return;

  const a = document.createElement('a');
  a.href = href;
  a.className = `btn ${cls}`;
  a.innerHTML = `
    <span class="ico"><i class="${icon}"></i></span>
    <span>${label}</span>
    <span class="badge">${badge ?? ''}</span>
  `;

  a.addEventListener('click', (e) => {
    e.preventDefault();

    // Toast animado
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

    // Abrir link após o toast
    setTimeout(() => {
      // Menu digital abre na mesma aba
      if (key === 'menu') {
        window.location.href = href;
      } else {
        // Outros links externos
        window.open(href, '_blank');
      }
    }, 1300);
  });

  linksEl.appendChild(a);
});
