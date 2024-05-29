const jwt = require("jsonwebtoken");
const JWT_SECRET = "ifsp";

function authMiddleware(req, res, next) {
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
    req.user = decoded;
    console.log("Decoded:", decoded);
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
}

module.exports = authMiddleware;
