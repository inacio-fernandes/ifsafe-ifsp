const express = require("express");
const home = require("./routes/home");
const users = require("./routes/users");
const posts = require("./routes/posts");
const auth = require("./jwt/auth");
const authMiddleware = require("./jwt/authMiddleware");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/auth", auth); // Rota de autenticação
app.use("/home", home);
app.use("/users", users);
app.use("/posts", authMiddleware, posts); // Protege a rota de posts

// Connection
const port = 3000;
//print console quebrar linha

app.listen(port, () => console.log(`Listening to port ${port}`));

console.log("\n\n\n\n\n\n--------------------------------------------------------------");