// src/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

export async function connectDB() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database
  });

  // carrega e aplica schema do models.sql
  const schema = fs.readFileSync("./src/models.sql", "utf8");
  await db.exec(schema);

  return db;
}
