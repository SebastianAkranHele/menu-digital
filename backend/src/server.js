// src/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";
import indexDataRoutes from "./routes/indexData.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Para __dirname funcionar em ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir uploads (imagens do CRUD)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Servir assets (imagens iniciais, logo, hero-bg etc.)
app.use("/assets", express.static(path.join(__dirname, "../assets")));


// =====================
// Rotas públicas
// =====================
app.use("/api/public/categories", categoryRoutes);
app.use("/api/public/products", productRoutes);

// GET público para o index (visível no site)
app.get("/api/public/index", async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.get("SELECT * FROM index_data WHERE id = 1");
    if (data?.buttons) data.buttons = JSON.parse(data.buttons);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados do index" });
  }
});


// =====================
// Rotas protegidas (admin)
// =====================
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/index", authMiddleware, indexDataRoutes); // CRUD completo do index

// Login sem proteção
app.use("/api/auth", authRoutes);

// =====================
// Inicia servidor
// =====================
app.listen(PORT, async () => {
  const db = await connectDB();
  console.log("📦 Base de dados conectada");
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📂 Uploads disponíveis em http://localhost:${PORT}/uploads`);
});
