// Import packages
const express = require("express");
const home = require("./routes/home");
const users = require("./routes/users" );
const posts = require("./routes/posts");
// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);
app.use("/users", users);
app.use("/posts", posts);

// connection
const port = 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

