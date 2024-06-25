const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { conectarAoMongoDB, getDB } = require("../coneccaobd");

// Segredo para assinar o JWT (deve ser armazenado em uma variável de ambiente)
const JWT_SECRET = "ifsp";

// Rota de autenticação
router.post("/", async (req, res) => {
  try {
    await conectarAoMongoDB();
    const { email, password } = req.body;
    const user = await getDB().collection("users").findOne({ email });

    if (!user) {
      return res.status(401).send("Email ou senha inválidos 1");
    }

    
    if (user.password !== password) {
      return res.status(401).send("Email ou senha inválidos 2");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "500h" });

    res.send({ token, user: { id: user._id, email: user.email, name: user.name, admin: user.admin, avatar: user.avatar } });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send("Erro ao fazer login");
  }
});

module.exports = router;
