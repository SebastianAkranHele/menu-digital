import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // Cria tabelas se não existirem
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

    CREATE TABLE IF NOT EXISTS index_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hero_bg TEXT,
      hero_logo TEXT,
      hero_title TEXT,
      hero_subtitle TEXT,
      footer_text TEXT,
      footer_qr TEXT,
      buttons TEXT
    );
  `);

  // Inserir registro inicial se não existir
  await db.run(`
    INSERT OR IGNORE INTO index_data 
    (id, hero_bg, hero_logo, hero_title, hero_subtitle, footer_text, footer_qr, buttons)
    VALUES 
    (1, 
     'assets/img/hero-bg.jpg', 
     'assets/img/magaf1.jpg', 
     'Garrafeira Das 5 Curvas', 
     'O ponto de referência em vinhos e bebidas', 
     '🍷 Saúde! — Garrafeira Das 5 Curvas', 
     'O ponto de referência', 
     '{"menu":"menu.html","whatsapp":"https://wa.me/244900000000","instagram":"https://instagram.com/minhagarrafeira","facebook":"https://facebook.com/minhagarrafeira"}'
    )
  `);

  console.log("📦 Base de dados conectada com sucesso!");
  return db;
}
