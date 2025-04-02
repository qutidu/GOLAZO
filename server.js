require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour activer CORS
app.use(cors({
    origin: ["https://golazo-ksp7.onrender.com"],
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

// Connexion à MongoDB avec Mongoose
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connecté à MongoDB avec succès via Mongoose !"))
    .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));

// Exemple de modèle Mongoose
const ResponseSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}, { timestamps: true });

const Response = mongoose.model("Response", ResponseSchema);

// Route POST pour enregistrer un formulaire
app.post("/submit-form", async (req, res) => {
    try {
        const newResponse = new Response(req.body);
        await newResponse.save();
        console.log("📩 Données enregistrées :", req.body);
        res.status(200).json({ message: "✅ Formulaire reçu avec succès !" });
    } catch (err) {
        console.error("❌ Erreur lors de l'enregistrement :", err);
        res.status(500).json({ message: "❌ Une erreur est survenue." });
    }
});

// Route GET pour récupérer les réponses
app.get("/responses", async (req, res) => {
    try {
        const responses = await Response.find();
        res.status(200).json(responses);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des données :", err);
        res.status(500).json({ message: "❌ Une erreur est survenue." });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});