const express = require("express");
const router = express.Router();
const { conectarAoMongoDB, getDB } = require("../coneccaobd");
const { ObjectId } = require("mongodb");

//pegar todos os posts
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



//pegar todos os posts de um autor
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
      status: "Pendente",
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

// Rota para alterar o STATUS um post com um ID específico
router.put("/status/:id", async (req, res) => {  
  try {
    await conectarAoMongoDB();

    const { id } = req.params;
    const { status } = req.body;
    if (status != "Pendente" || status != "Solucionado" || status != "Cancelado") {
      return res.status(400).send("Status do post é obrigatório");
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID de post inválido");
    }

    // verifica se o o ususario tem admin: true   
    const user = await getDB().collection("users").findOne({ _id: ObjectId(req.user) });
    console.log("user do put", user);
    if (user.admin !== true) {
      return res.status(403).send("Você não tem permissão para alterar o status do post");
    };


    await getDB().collection("posts").updateOne(
      { _id: ObjectId(id) },
      { $set: { status } }
    );

    res.send("Status do post alterado com sucesso!");
  } catch (error) {
    console.error("Erro ao alterar status do post:", error);
    res.status(500).send("Erro ao alterar status do post", error);
  }
});

//Adicionar um comentario em um post especifico nessa estrutura 
router.post("/comentarios/:id", async (req, res) => {
  try {
    await conectarAoMongoDB();

    const { id } = req.params;
    const { comentario } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID de post inválido");
    }

    const newComent = {
      [req.user.id]: comentario
    };
 console.log("newComent", newComent);
    await getDB().collection("posts").updateOne(
      { _id: ObjectId(id) },
      { $push: { comentarios: newComent } }
    );

    res.send("Comentário adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    res.status(500).send("Erro ao adicionar comentário", error);
  }
});


//Adicionar uma curtida em um post especifico, pega o user.id e adiciona no array de likes
router.post("/likes/:id", async (req, res) => {
  try {
    await conectarAoMongoDB();

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID de post inválido");
    }

    await getDB().collection("posts").updateOne(
      { _id: ObjectId(id) },
      { $push: { likes: req.user.id } }
    );

    res.send("Like adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar like:", error);
    res.status(500).send("Erro ao adicionar like", error);
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
  req.body = { description, image, name };
  next();
}

module.exports = router;
