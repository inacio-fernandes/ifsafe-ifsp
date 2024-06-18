const express = require("express");
const { getDB } = require("../coneccaobd");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { conectarAoMongoDB } = require("../coneccaobd");
const authMiddleware = require("../jwt/authMiddleware");

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

router.get("/id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await conectarAoMongoDB();
    const user = await getDB().collection("users").findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).send(user.name);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar usuário");
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .send("Todos os campos (email, password, name) são necessários");
    }
    email = email.toLowerCase();
    const newUser = {
      email,
      password,
      name,
      admin: false,
    };
    await conectarAoMongoDB();
    const user = await getDB()
      .collection("users")
      .findOne({ email: (newUser.email) });
    if (user) {
      return res.status(404).send("Email ja cadastrado");
    } 

    
    await getDB().collection("users").insertOne(newUser); // Insere o usuário na coleção
    res.status(201).send("Usuário criado com sucesso!"); // Use 201 for created resources
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro ao criar usuário");
  }
});




const verifyIdenty = (req, res, next) => {

  const userIdFromToken = req.user.id;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) { 
    return res
      .status(403)
      .send("Você não tem permissão para atualizar este usuário");
  }
  next();
};


// PUT /users/:id - Atualiza a senha com um ID específico
router.put("/:id", authMiddleware, verifyIdenty, async (req, res) => {
  try {
    const userIdFromParams = req.params.id;
    const { newpassword, oldpassword, name, avatar } = req.body;
    console.log("body", req.body);  
    const updateData = {};

    if (newpassword) {
      updateData.password = newpassword;
    }

    if (name) {
      updateData.name = name;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    await conectarAoMongoDB();
    console.log("updateData", updateData);
    const user = await getDB()
      .collection("users")
      .findOne({ _id: ObjectId(userIdFromParams) });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    if (oldpassword !== user.password) {
      console.log("oldpassword", oldpassword, "user.password", user.password);
      return res.status(400).send("Senha antiga não confere");
    }

    const result = await getDB()
      .collection("users")
      .updateOne({ _id: ObjectId(userIdFromParams) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).send("Usuário atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

module.exports = router;

