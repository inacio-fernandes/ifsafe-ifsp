const express = require("express");
const { getDB } = require("../coneccaobd");
const router = express.Router();
const { conectarAoMongoDB } = require("../coneccaobd");

// GET /users
router.get("/", async (req, res) => {
  try {
    await conectarAoMongoDB();

    const usuarios = await getDB().collection("users").find({});
    const listaUsuarios = [];
    for await (const usuario of usuarios) {
      listaUsuarios.push(usuario);
    }
    console.log(listaUsuarios);
    res.status(200).send(listaUsuarios);
  } catch (error) {
    res.status(500).send("Erro ao buscar todos usuarios", error);
    console.error("Erro ao buscar todos usuarios:", error);
  }
});

// POST /users
router.post("/", async (req, res) => {
  try {
     console.log(req.body);
    if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password")) {
      return res.status(400).send("O usuário não possui senha ou e-mail");
    }

    newUser = req.body;
    await conectarAoMongoDB();
    
    console.log(newUser);

    await getDB().collection("users").insertOne(newUser); // Insere o alerta na collection
    res.send("Usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro ao criar usuário");
  }
});

// PUT /users/:id
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic to update a specific user by ID
  res.send(`Update user with ID ${userId}`);
});

module.exports = router;
