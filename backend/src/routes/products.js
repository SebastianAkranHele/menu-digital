import { openDb } from "../db.js";
import express from "express";

const router = express.Router();

// GET todos os produtos
router.get("/", async (req, res) => {
  const db = await openDb();
  const products = await db.all("SELECT * FROM products");
  res.json(products);
});

// POST novo produto
router.post("/", async (req, res) => {
  const { name, price, description, image, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nome e preço são obrigatórios" });
  }

  const db = await openDb();
  const result = await db.run(
    "INSERT INTO products (name, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)",
    [name, price, description, image, category_id]
  );

  res.json({
    id: result.lastID,
    name,
    price,
    description,
    image,
    category_id,
  });
});

export default router;
