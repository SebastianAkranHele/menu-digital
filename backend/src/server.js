// src/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/authMiddleware.js"; // <-- adicionar

const app = express();
const PORT = process.env.PORT || 4000;

// Para __dirname funcionar em ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());

// servir uploads como estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rotas públicas
app.use("/api/public/categories", categoryRoutes); 
app.use("/api/public/products", productRoutes);  

// Rotas protegidas (admin)
app.use("/api/categories", authMiddleware, categoryRoutes);  
app.use("/api/products", authMiddleware, productRoutes);  

// Login sem proteção
app.use("/api/auth", authRoutes);



// inicia servidor
app.listen(PORT, async () => {
  const db = await connectDB();
  console.log("📦 Base de dados conectada");
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📂 Uploads disponíveis em http://localhost:${PORT}/uploads`);
});
