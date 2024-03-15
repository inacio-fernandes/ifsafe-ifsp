const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://vercel-admin-user:9mJdEoQrfRNWL0ZC@cluster0.pn6kvst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
