import express from "express";
import cors from "cors";
import { openDb } from "./db.js";
import fs from "fs";
import productsRoutes from "./routes/products.js";



const app = express();
app.use("/api/products", productsRoutes);
app.use(cors());
app.use(express.json());


// cria tabelas no arranque
(async () => {
  const db = await openDb();
  const schema = fs.readFileSync("./src/models.sql", "utf-8");
  await db.exec(schema);
})();

// teste inicial
app.get("/", (req, res) => {
  res.json({ message: "✅ API do Menu Digital está online!" });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
