const express = require("express");
const router = express.Router();
const { conectarAoMongoDB, getDB } = require("../coneccaobd");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  try {
    await conectarAoMongoDB();
    console.log("req.user", req.user);
    const posts = await getDB().collection("posts").find({});
    const listaPosts = await posts.toArray(); // Convertendo cursor para array
    console.log(listaPosts);
    res.status(200).send(listaPosts);
  } catch (error) {
    res.status(500).send("Erro ao buscar todos posts", error);
    console.error("Erro ao buscar todos posts:", error);
  }
});

router.get("/autor/:id", async (req, res) => {
  try {
    let hora = new Date().toLocaleTimeString();
    console.log("Hora antes: ", hora);

    await conectarAoMongoDB();

    hora = new Date().toLocaleTimeString();
    console.log("Hora meio: ", hora);

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID de usuario inválido");
    }

    const posts = await getDB()
      .collection("posts")
      .find({ autor: id}).toArray();

        hora = new Date().toLocaleTimeString();
        console.log("Hora meio: ", hora);
    if (!posts) {
      return res.status(404).send("Posts não encontrados");
    }

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send("Erro ao buscar posts", error);
    console.error("Erro ao buscar posts:", error);
  }
});

// Rota para criar um novo post
router.post("/", validatePostData, async (req, res) => {
  try {
    await conectarAoMongoDB();

    const newPost = {
      ...req.body,
      autor: req.userId,
      date: new Date(),
      status: 1,
      likes: [],
      coments: []
    };
    await getDB().collection("posts").insertOne(newPost);

    res.send("Post criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).send("Erro ao criar post", error);
  }
});

// Rota para deletar um post com um ID específico
router.put("/:id", async (req, res) => {
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



function validatePostData(req, res, next) {
  const { description, image, name} = req.body;

  if (
    ! description ||
    !image ||
    !name 
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  next();
}

module.exports = router;
