// src/routes/categories.js
import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

/**
 * GET /api/categories
 * Lista todas as categorias → PÚBLICO
 */
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const categories = await db.all("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

/**
 * GET /api/categories/:id
 * Obtém uma categoria específica → PÚBLICO
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const category = await db.get("SELECT * FROM categories WHERE id = ?", [id]);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
});

/**
 * POST /api/categories
 * Cria nova categoria → PROTEGIDO (aplicado no server.js)
 */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Nome é obrigatório e deve ter pelo menos 2 caracteres" });
    }

    const db = await connectDB();
    const result = await db.run("INSERT INTO categories (name) VALUES (?)", [name.trim()]);

    res.status(201).json({ id: result.lastID, name: name.trim() });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Categoria já existe" });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

/**
 * PUT /api/categories/:id
 * Atualiza categoria → PROTEGIDO
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Nome é obrigatório e deve ter pelo menos 2 caracteres" });
    }

    const db = await connectDB();
    const result = await db.run("UPDATE categories SET name = ? WHERE id = ?", [name.trim(), id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ id, name: name.trim() });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Categoria já existe" });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

/**
 * DELETE /api/categories/:id
 * Remove categoria → PROTEGIDO
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    // Verifica se existem produtos vinculados
    const products = await db.all("SELECT * FROM products WHERE category_id = ?", [id]);
    if (products.length > 0) {
      return res.status(400).json({ error: "Não é possível remover categoria com produtos vinculados" });
    }

    const result = await db.run("DELETE FROM categories WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ message: "Categoria removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover categoria" });
  }
});

export default router;
