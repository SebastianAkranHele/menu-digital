// src/routes/products.js
import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

/**
 * GET /api/products
 * Lista todos os produtos com suas categorias
 */
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

/**
 * GET /api/products/:id
 * Obtém um produto específico
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const product = await db.get(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

/**
 * POST /api/products
 * Cria novo produto
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    const db = await connectDB();

    // Verifica se a categoria existe
    if (category_id) {
      const category = await db.get("SELECT * FROM categories WHERE id = ?", [category_id]);
      if (!category) {
        return res.status(400).json({ error: "Categoria inválida" });
      }
    }

    const result = await db.run(
      "INSERT INTO products (name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), description?.trim(), price, image?.trim(), category_id || null]
    );

    res.status(201).json({ id: result.lastID, name, description, price, image, category_id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

/**
 * PUT /api/products/:id
 * Atualiza produto
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    const db = await connectDB();

    // Verifica se a categoria existe
    if (category_id) {
      const category = await db.get("SELECT * FROM categories WHERE id = ?", [category_id]);
      if (!category) {
        return res.status(400).json({ error: "Categoria inválida" });
      }
    }

    const result = await db.run(
      "UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ? WHERE id = ?",
      [name.trim(), description?.trim(), price, image?.trim(), category_id || null, id]
    );

    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });

    res.json({ id, name, description, price, image, category_id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

/**
 * DELETE /api/products/:id
 * Remove produto
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const result = await db.run("DELETE FROM products WHERE id = ?", [id]);

    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });

    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover produto" });
  }
});

export default router;
