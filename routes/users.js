const express = require("express");
const { getDB, conectarAoMongoDB } = require("../coneccaobd");
const { ObjectId } = require("mongodb");
const authMiddleware = require("../jwt/authMiddleware");

const router = express.Router();

// Middleware para verificar a identidade
const verifyIdenty = (req, res, next) => {
  const userIdFromToken = req.user.id;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    return res
      .status(403)
      .send("Você não tem permissão para atualizar este usuário");
  }

  // Se a identidade for verificada com sucesso, chame next() para continuar com a próxima função de middleware ou rota
  next();
};

// GET /users - Obtém todos os usuários
router.get("/", async (req, res) => {
  try {
    await conectarAoMongoDB();
    const usuarios = await getDB().collection("users").find({}).toArray();
    res.status(200).send(usuarios);
  } catch (error) {
    console.error("Erro ao buscar todos usuários:", error);
    res.status(500).send("Erro ao buscar todos usuários");
  }
});

// GET /users/id - Obtém o nome do usuário autenticado
router.get("/id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await conectarAoMongoDB();
    const user = await getDB()
      .collection("users")
      .findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }
    res.status(200).send(user.name);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar usuário");
  }
});




// POST /users - Cria um novo usuário
router.post("/", async (req, res) => {
  try {
    let { email, password, name, avatar } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .send("Todos os campos (email, password, namee avatar) são necessários");
    }
    email = email.toLowerCase();
    const newUser = { email, password, name, admin: false, avatar};
    await conectarAoMongoDB();
    const user = await getDB().collection("users").findOne({ email });
    if (user) {
      return res.status(409).send("Email já cadastrado");
    }
    await getDB().collection("users").insertOne(newUser);
    res.status(201).send("Usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro ao criar usuário");
  }
});




// PUT /users/:id - Atualiza o usuário com um ID específico
router.put("/:id", authMiddleware, verifyIdenty, async (req, res) => {
  try {
    const userIdFromParams = req.params.id;
    const { newpassword, oldpassword, name, avatar } = req.body;

    await conectarAoMongoDB();
    const user = await getDB().collection("users").findOne({ _id: ObjectId(userIdFromParams) });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    const updateData = {};
    if (newpassword) {
      // Não é necessário chamar verifyIdenty(req, res) aqui, pois o middleware já foi executado
      if (oldpassword !== req.user.password) {
        console.log("Senha antiga:", oldpassword, " Senha do usuário ", user.password);
        return res.status(400).send("Senha antiga não confere");
      }
      updateData.password = newpassword;
    }
    if (name) {
      updateData.name = name;
    }
    if (avatar) {
      updateData.avatar = avatar;
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
