# 🍷 Backend - Menu Digital (Garrafeira)

Este é o backend do projeto **Menu Digital**, desenvolvido com **Node.js + Express + SQLite**.  
Ele fornece uma API REST para gerir **categorias** e **produtos**.

---

## 🚀 Tecnologias
- Node.js
- Express
- SQLite (com `sqlite` + `sqlite3`)
- Nodemon (ambiente de desenvolvimento)

---

## 📦 Instalação

1. Clonar o repositório:
   ```bash
   git clone https://github.com/teu-usuario/menu-digital.git
   cd menu-digital/backend
Instalar as dependências:

npm install

⚙️ Scripts disponíveis

Iniciar o servidor:

npm start


Servidor rodando em: http://localhost:4000

Iniciar em modo de desenvolvimento (com auto-reload):

npm run dev


Criar tabelas no banco de dados:

npm run initdb


Inserir dados iniciais (categorias + produtos):

npm run seed


Inspecionar banco de dados (ver tabelas, categorias e produtos):

npm run inspect

📂 Estrutura de pastas
backend/
 ├─ src/
 │   ├─ routes/
 │   │   ├─ products.js
 │   │   └─ categories.js
 │   ├─ db.js
 │   └─ server.js
 ├─ scripts/
 │   ├─ initDb.js
 │   ├─ seedDb.js
 │   └─ inspectDb.js
 ├─ database.db
 ├─ package.json
 └─ README.md

🛠️ Endpoints da API
Categorias

GET /api/categories → lista todas as categorias

POST /api/categories → cria uma nova categoria

Produtos

GET /api/products → lista todos os produtos (com nome da categoria)

POST /api/products → cria um novo produto