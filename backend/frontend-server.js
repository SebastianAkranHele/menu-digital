import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// define a pasta base do frontend (raiz do menu-digital)
app.use(express.static(path.join(__dirname, "..")));

// rota principal: abre o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// rota dinâmica para qualquer página .html
app.get("/:page", (req, res) => {
  const page = `${req.params.page}.html`;
  const filePath = path.join(__dirname, "..", page);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Página não encontrada");
    }
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend disponível em http://localhost:${PORT}`);
});
