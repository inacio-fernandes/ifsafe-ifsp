const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb+srv://vercel-admin-user:2M9VYX2W5hmjHFSz@cluster0.pn6kvst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let db;

async function conectarAoMongoDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true, // Remova isso se estiver usando o driver 4.0.0 ou superior
      useUnifiedTopology: true,
    });

    db = client.db("ifsafe-ifsp");

    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro na conexão com o MongoDB:", error);
    throw error;
  }
}

module.exports = {
  conectarAoMongoDB,
  getDB: () => db,
};
