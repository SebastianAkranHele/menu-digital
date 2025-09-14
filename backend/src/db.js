import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // cria tabelas se não existirem
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      image TEXT,
      category_id INTEGER,
      stock INTEGER,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
  `);

  console.log("📦 Base de dados conectada com sucesso!");
  return db;
}
