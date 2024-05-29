const { MongoClient } = require("mongodb");

let MONGODB_URI =
  "mongodb+srv://vercel-admin-user:9mJdEoQrfRNWL0ZC@cluster0.pn6kvst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let db;
let client;

async function conectarAoMongoDB() {
  if (db) {
    console.log("Conexão já estabelecida com o MongoDB");
    return db;
  }

  try {
    client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = client.db("ifsafe-ifsp");

    console.log("Conectado ao MongoDB");
    return db;
  } catch (error) {
    console.error("Erro na conexão com o MongoDB:", error); // Corrigido "console.errr" para "console.error"
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error(
      "Banco de dados não conectado. Chame conectarAoMongoDB primeiro."
    );
  }
  return db;
}

process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("Conexão com o MongoDB fechada.");
    process.exit(0);
  }
});

module.exports = {
  conectarAoMongoDB,
  getDB,
};
