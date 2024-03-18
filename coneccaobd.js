const { MongoClient } = require("mongodb");

let MONGODB_URI;
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
