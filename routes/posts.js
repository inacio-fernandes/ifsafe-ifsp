const express = require("express");
const router = express.Router();
const { conectarAoMongoDB, getDB } = require("../coneccaobd");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  try {
    await conectarAoMongoDB();

    const posts = await getDB().collection("posts").find({});
    const listaPosts = await posts.toArray(); // Convertendo cursor para array
    console.log(listaPosts);
    res.status(200).send(listaPosts);
  } catch (error) {
    res.status(500).send("Erro ao buscar todos posts", error);
    console.error("Erro ao buscar todos posts:", error);
  }
});

// Rota para criar um novo post
router.post("/", async (req, res) => {
  try {
    // Conecta ao MongoDB antes de usar a variável db
    await conectarAoMongoDB();


    console.log(req.body);
    const newPost = req.body;
    await getDB().collection("posts").insertOne(newPost); // Insere o post na coleção
    res.send("Post criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).send("Erro ao criar post", error);
  }
});

// Rota para deletar um post com um ID específico
router.delete("/:id", async (req, res) => {
  try {
    await conectarAoMongoDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID de post inválido");
    }

    const result = await getDB()
      .collection("posts")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send("Post não encontrado");
    }

    res.send("Post deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    res.status(500).send("Erro ao deletar post");
  }
});

module.exports = router;
