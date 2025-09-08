// src/server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/authMiddleware.js"; // <-- adicionar

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

// rotas
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/auth", authRoutes);

// inicia servidor
app.listen(PORT, async () => {
  const db = await connectDB();
  console.log("📦 Base de dados conectada");
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});
