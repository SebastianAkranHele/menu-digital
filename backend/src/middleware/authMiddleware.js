// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const SECRET = "minha_chave_secreta"; // ⚠️ em produção usar variável de ambiente

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // adiciona dados do usuário à requisição
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
