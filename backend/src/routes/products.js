// src/routes/products.js
import express from "express";
import multer from "multer";
import { connectDB } from "../db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// =======================
// Configuração do multer
// =======================
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// =======================
// Função helper de imagem
// =======================
function resolveImageUrl(req, image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${req.protocol}://${req.get("host")}${image}`;
}

// =======================
// ROTAS PÚBLICAS
// =======================
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `);

    products.forEach(p => {
      p.image = resolveImageUrl(req, p.image);
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const product = await db.get(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    product.image = resolveImageUrl(req, product.image);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// =======================
// ROTAS PROTEGIDAS (POST, PUT, DELETE) → proteger no server.js
// =======================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image: imageUrl } = req.body;
    let image = imageUrl;
    if (req.file) image = path.posix.join("/uploads", req.file.filename);
    if (!name || !price) return res.status(400).json({ error: "Nome e preço são obrigatórios" });

    const db = await connectDB();
    if (category_id) {
      const cat = await db.get("SELECT * FROM categories WHERE id = ?", [category_id]);
      if (!cat) return res.status(400).json({ error: "Categoria inválida" });
    }

    const safeImage = image ? image.trim() : null;
    const result = await db.run(
      "INSERT INTO products (name, description, price, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), description?.trim() || null, price, safeImage, category_id || null, stock || 0]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      description,
      price,
      image: resolveImageUrl(req, safeImage),
      category_id,
      stock: stock || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, stock, image: imageUrl } = req.body;
    let image = imageUrl;
    if (req.file) image = path.posix.join("/uploads", req.file.filename);
    if (!name || !price) return res.status(400).json({ error: "Nome e preço são obrigatórios" });

    const db = await connectDB();
    if (category_id) {
      const cat = await db.get("SELECT * FROM categories WHERE id = ?", [category_id]);
      if (!cat) return res.status(400).json({ error: "Categoria inválida" });
    }

    const safeImage = image ? image.trim() : null;
    const result = await db.run(
      "UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ?, stock = ? WHERE id = ?",
      [name.trim(), description?.trim() || null, price, safeImage, category_id || null, stock || 0, id]
    );

    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });

    res.json({
      id,
      name,
      description,
      price,
      image: resolveImageUrl(req, safeImage),
      category_id,
      stock: stock || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const result = await db.run("DELETE FROM products WHERE id = ?", [id]);
    if (result.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });

    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover produto" });
  }
});

export default router;
