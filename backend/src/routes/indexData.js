// src/routes/indexData.js
import express from "express";
import { connectDB } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Pasta de uploads
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuração do multer com validação
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Função para remover arquivo antigo se um novo foi enviado
const removeOldFile = (oldFilePath, newFilePath) => {
  if (oldFilePath && oldFilePath !== newFilePath && 
      !oldFilePath.includes('assets/') && // Não remove arquivos da pasta assets
      fs.existsSync(path.join(process.cwd(), oldFilePath.substring(1)))) {
    try {
      fs.unlinkSync(path.join(process.cwd(), oldFilePath.substring(1)));
    } catch (err) {
      console.error('Erro ao remover arquivo antigo:', err);
    }
  }
};

// =======================
// GET /api/index → pegar os dados do index
// =======================
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.get("SELECT * FROM index_data WHERE id = 1");
    
    if (!data) {
      return res.status(404).json({ error: "Dados do index não encontrados" });
    }
    
    if (data?.buttons) {
      try {
        data.buttons = JSON.parse(data.buttons);
      } catch (e) {
        console.error('Erro ao parsear buttons:', e);
        data.buttons = {};
      }
    }

    // 🔥 Montar URLs completas
    const baseURL = `${req.protocol}://${req.get("host")}`;
    if (data.hero_bg && !data.hero_bg.startsWith("http")) {
      data.hero_bg = `${baseURL}${data.hero_bg}`;
    }
    if (data.hero_logo && !data.hero_logo.startsWith("http")) {
      data.hero_logo = `${baseURL}${data.hero_logo}`;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados do index" });
  }
});


// =======================
// PUT /api/index → atualizar dados do index com imagens
// =======================
router.put(
  "/",
  upload.fields([
    { name: "hero_bg", maxCount: 1 },
    { name: "hero_logo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { hero_title, hero_subtitle, footer_text, footer_qr, buttons } = req.body;

      // Validação básica
      if (buttons) {
        try {
          JSON.parse(buttons);
        } catch (e) {
          return res.status(400).json({ error: "Formato inválido para buttons" });
        }
      }

      const db = await connectDB();

      // Busca valores atuais
      const current = await db.get("SELECT * FROM index_data WHERE id = 1");
      if (!current) {
        return res.status(404).json({ error: "Dados do index não encontrados" });
      }

      // Define novos caminhos se arquivos foram enviados
      let hero_bg = current.hero_bg;
      let hero_logo = current.hero_logo;

      // Processar hero_bg se enviado
      if (req.files?.hero_bg) {
        removeOldFile(current.hero_bg, `/uploads/${req.files.hero_bg[0].filename}`);
        hero_bg = `/uploads/${req.files.hero_bg[0].filename}`;
      }

      // Processar hero_logo se enviado
      if (req.files?.hero_logo) {
        removeOldFile(current.hero_logo, `/uploads/${req.files.hero_logo[0].filename}`);
        hero_logo = `/uploads/${req.files.hero_logo[0].filename}`;
      }

      // Preparar dados para atualização
      const updateData = {
        hero_bg,
        hero_logo,
        hero_title: hero_title || current.hero_title,
        hero_subtitle: hero_subtitle || current.hero_subtitle,
        footer_text: footer_text || current.footer_text,
        footer_qr: footer_qr || current.footer_qr,
        buttons: buttons ? buttons : current.buttons
      };

      // Atualiza o banco
      await db.run(
        `
        UPDATE index_data
        SET 
          hero_bg = ?,
          hero_logo = ?,
          hero_title = ?,
          hero_subtitle = ?,
          footer_text = ?,
          footer_qr = ?,
          buttons = ?
        WHERE id = 1
      `,
        [
          updateData.hero_bg,
          updateData.hero_logo,
          updateData.hero_title,
          updateData.hero_subtitle,
          updateData.footer_text,
          updateData.footer_qr,
          updateData.buttons
        ]
      );

      const updatedData = await db.get("SELECT * FROM index_data WHERE id = 1");
      if (updatedData?.buttons) {
        try {
          updatedData.buttons = JSON.parse(updatedData.buttons);
        } catch (e) {
          console.error('Erro ao parsear buttons:', e);
          updatedData.buttons = {};
        }
      }

      res.json(updatedData);
    } catch (err) {
      console.error(err);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "Arquivo muito grande. Tamanho máximo: 5MB" });
        }
      }
      
      res.status(500).json({ error: "Erro ao atualizar dados do index" });
    }
  }
);

export default router;