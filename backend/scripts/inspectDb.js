// scripts/inspectDb.js
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// Listar tabelas
console.log("📂 Tabelas existentes:");
const tables = await db.all(
  "SELECT name FROM sqlite_master WHERE type='table'"
);
console.table(tables);

// Listar categorias
console.log("\n📦 Categorias:");
const categories = await db.all("SELECT * FROM categories");
console.table(categories);

// Listar produtos com categoria
console.log("\n🍷 Produtos:");
const products = await db.all(`
  SELECT p.id, p.name, p.price, p.description, c.name AS category
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
`);
console.table(products);

await db.close();
