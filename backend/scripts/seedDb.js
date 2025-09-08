// scripts/seedDb.js
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt"; // <-- instalar: npm install bcrypt

const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// Limpar tabelas antes (opcional)
await db.exec("DELETE FROM products");
await db.exec("DELETE FROM categories");
await db.exec("DELETE FROM users");

// Resetar IDs
await db.exec("DELETE FROM sqlite_sequence WHERE name IN ('products', 'categories', 'users')");



// Inserir categorias
const categories = ["Vinhos", "Espumantes", "Whisky"];
for (const name of categories) {
  await db.run("INSERT INTO categories (name) VALUES (?)", [name]);
}

// Inserir produtos
await db.run(
  "INSERT INTO products (name, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)",
  ["Flor de Penalva", 15.5, "Vinho tinto jovem e frutado", null, 1]
);
await db.run(
  "INSERT INTO products (name, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)",
  ["Nau Dourada", 20, "Espumante leve e refrescante", null, 2]
);
await db.run(
  "INSERT INTO products (name, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)",
  ["Jameson", 30, "Whisky irlandês suave", null, 3]
);

// Criar admin (senha 1234 hasheada)
const passwordHash = await bcrypt.hash("1234", 10);
await db.run(
  "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
  ["Administrador", "admin@magaf.com", passwordHash]
);

console.log("✅ Dados inseridos com sucesso!");
await db.close();
