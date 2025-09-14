// scripts/seedDb.js
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt"; // npm install bcrypt

const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// Criar tabelas se não existirem
await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  image TEXT,
  category_id INTEGER,
  stock INTEGER DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
`);

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

// Inserir produtos com estoque
await db.run(
  "INSERT INTO products (name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)",
  ["Flor de Penalva", 15.5, "Vinho tinto jovem e frutado", null, 1, 10]
);
await db.run(
  "INSERT INTO products (name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)",
  ["Nau Dourada", 20, "Espumante leve e refrescante", null, 2, 8]
);
await db.run(
  "INSERT INTO products (name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)",
  ["Jameson", 30, "Whisky irlandês suave", null, 3, 5]
);

// Criar admin (senha 1234 hasheada)
const passwordHash = await bcrypt.hash("1234", 10);
await db.run(
  "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
  ["Administrador", "admin@magaf.com", passwordHash]
);

console.log("✅ Dados inseridos com sucesso!");
await db.close();
