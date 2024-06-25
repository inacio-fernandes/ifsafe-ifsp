const jwt = require("jsonwebtoken");
const JWT_SECRET = "ifsp";
const { conectarAoMongoDB, getDB } = require("../coneccaobd");
const { ObjectId } = require("mongodb");

async function authMiddleware(req, res, next) {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).send("Acesso negado. Nenhum token fornecido.");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) {
    return res.status(401).send("Acesso negado. Formato de token inválido.");
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
    await conectarAoMongoDB();
    const userFromBD = await getDB()
      .collection("users")
      .findOne({ _id: ObjectId(userId) });

    req.user = userFromBD;
    req.user.id = req.user._id.toString();
    next();
    console.log("req.user", req.user);
    console.log("req.user.id", req.user._id.toString());
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(400).send("Token inválido.");
  }
}

module.exports = authMiddleware;
