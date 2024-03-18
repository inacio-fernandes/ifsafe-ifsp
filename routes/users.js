const express = require("express");
const { getDB } = require("../coneccaobd");
const router = express.Router();
const { conectarAoMongoDB } = require("../coneccaobd");

// GET /users
router.get("/", async (req, res) => {
  try {
    await conectarAoMongoDB();

    const usuarios = await getDB().collection("users").find({});
    const listaUsuarios = await usuarios.toArray(); // Use toArray() for efficient retrieval
    console.log(listaUsuarios);
    res.status(200).send(listaUsuarios);
  } catch (error) {
    res.status(500).send("Erro ao buscar todos usuarios" + error);
    console.error("Erro ao buscar todos usuarios:", error);
  }
});

// POST /users
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    if (
      !req.body.hasOwnProperty("email") ||
      !req.body.hasOwnProperty("password")
    ) {
      return res.status(400).send("O usuário não possui senha ou e-mail");
    }

    const newUser = req.body;
    await conectarAoMongoDB();
    console.log(newUser);

    await getDB().collection("users").insertOne(newUser); // Insere o alerta na collection
    res.status(201).send("Usuário criado com sucesso!"); // Use 201 for created resources
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro ao criar usuário");
  }
});

// PUT /users/:id
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body; // Assuming you have update data in the request body

    await conectarAoMongoDB();
    const result = await getDB()
      .collection("users")
      .updateOne(
        { _id: ObjectId(userId) }, // Use ObjectId for MongoDB ID handling
        { $set: updateData } // Assuming you want to update specific fields using $set
      );

    if (result.matchedCount === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).send("Usuário atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

module.exports = router;
