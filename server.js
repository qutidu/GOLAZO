const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB (REMPLACE "<password>" par ton vrai mot de passe)
const mongoURI = "mongodb+srv://alfred:<coug>@cluster0.yerknku.mongodb.net/formResponses?retryWrites=true&w=majority"; 

let db, collection;

// Middleware pour activer CORS
app.use(cors({
    origin: ["https://golazo-ksp7.onrender.com"], // Autoriser uniquement ton site
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

// Middleware global pour gérer les requêtes OPTIONS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://golazo-ksp7.onrender.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

// Middleware pour parser JSON et URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB
async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = client.db("formResponses"); // Nom de la base
        collection = db.collection("responses"); // Nom de la collection
        console.log("✅ Connecté à MongoDB avec succès !");
    } catch (err) {
        console.error("❌ Erreur de connexion à MongoDB :", err);
        process.exit(1); // Quitte l'application si la connexion échoue
    }
}
connectToMongoDB();

// Route POST pour enregistrer un formulaire
app.post("/submit-form", async (req, res) => {
    try {
        if (!collection) {
            return res.status(500).json({ message: "Connexion à MongoDB non établie." });
        }

        console.log("📩 Données reçues :", req.body);
        await collection.insertOne(req.body);
        res.status(200).json({ message: "✅ Formulaire reçu avec succès !" });

    } catch (err) {
        console.error("❌ Erreur lors de la sauvegarde :", err);
        res.status(500).json({ message: "Erreur lors de la sauvegarde des données." });
    }
});

// Route GET pour récupérer les réponses
app.get("/responses", async (req, res) => {
    try {
        if (!collection) {
            return res.status(500).json({ message: "Connexion à MongoDB non établie." });
        }

        const responses = await collection.find().toArray();
        res.status(200).json(responses);

    } catch (err) {
        console.error("❌ Erreur lors de la récupération des données :", err);
        res.status(500).json({ message: "Erreur lors de la récupération des données." });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});