// src/routes/auth.js
import express from "express";
import { connectDB } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.SECRET || "minha_chave_secreta";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectDB();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
});

export default router;
