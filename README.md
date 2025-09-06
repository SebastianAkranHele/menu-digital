🍷 Garrafeira MAGAVI — Hub Digital & Menu Digital

Este projeto é um sistema web responsivo desenvolvido para garrafeiras, restaurantes e estabelecimentos que desejam oferecer:

✅ Um hub digital com links rápidos para WhatsApp, localização, redes sociais e menu digital.
✅ Um menu digital dinâmico, com categorias, imagens, preços e descrições.
✅ Um painel administrativo simples para gerenciar produtos (usando localStorage).

📂 Estrutura do Projeto
/
├── index.html        # Hub digital com links principais (WhatsApp, menu, redes sociais)
├── menu.html         # Página do Menu Digital (visualização dos produtos)
├── menu-admin.html   # Painel Administrativo (gerenciamento de produtos)
├── assets/           # Imagens dos produtos e logotipo
│   ├── gm_9.jpg
│   ├── vinho-tinto.jpg
│   ├── whisky.jpg
│   ├── cerveja-ipa.jpg
│   ├── vinho-branco.jpg
│   ├── gin.jpg
│   └── ... (outras imagens)
└── README.md

🛠 Tecnologias Utilizadas

HTML5 — Estrutura semântica das páginas

CSS3 — Estilização responsiva com suporte a Dark Mode

JavaScript (ES6+) — Manipulação do DOM e lógica do menu/admin

LocalStorage — Persistência de dados no navegador

Font Awesome — Ícones para botões e menus

Responsividade — Layout adaptável para dispositivos móveis

✅ Funcionalidades
1. Hub Digital (index.html)

Exibe logotipo, nome e slogan da garrafeira

Botões para:

Menu Digital

WhatsApp

Google Maps (localização)

Instagram, Facebook, TikTok

Contato telefônico

Site oficial

Design elegante com cores vinho e dourado

2. Menu Digital (menu.html)

Lista de produtos organizados em categorias:

Vinhos

Destilados

Cervejas

Aperitivos

Promoções

Filtro por categoria (botões interativos)

Cards de produtos com:

Imagem

Nome

Descrição

Preço

Botão fixo para encomendas via WhatsApp

Acesso discreto ao painel administrativo

3. Painel Administrativo (menu-admin.html)

Gerenciamento de produtos:

Adicionar novos produtos

Editar produtos existentes

Excluir produtos

Upload de imagens (em Base64, via LocalStorage)

Categorias pré-definidas

Persistência local (não requer servidor)

Interface intuitiva com abas:

Produtos

Categorias

Configurações (futuro)

📦 Instalação e Uso
1. Clonar ou baixar o projeto
git clone https://github.com/SeuUsuario/garrafeira-digital.git

2. Estrutura recomendada

Coloque os arquivos index.html, menu.html, menu-admin.html e a pasta assets/ no mesmo diretório.

3. Executar localmente

Abra o arquivo index.html no navegador.

✅ Não é necessário servidor, pois tudo funciona com HTML, CSS e JS puro.

⚠ Limitações

Os dados são salvos no LocalStorage (limite de ~5MB por navegador).

Para uso profissional, recomenda-se:

Implementar backend (Node.js, PHP ou outro) para armazenar dados no banco.

Upload real de imagens para um servidor ou serviço de hospedagem.

Autenticação para o painel administrativo.

🚀 Melhorias Futuras

✅ Autenticação no painel admin

✅ Exportação/importação de dados (backup)

✅ Suporte a múltiplos idiomas

✅ Integração com API do WhatsApp para pedidos automáticos

✅ Tema personalizável via painel

📸 Preview

Index (Hub Digital)


👨‍💻 Autor

Sebastian Akran Hele
📧 Contacto: akranhele.17@gmail.com
]
🌍 Instagram: @minhagarrafeira