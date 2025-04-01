const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour activer CORS avec la bonne origine
app.use(cors({
    origin: ["https://golazo-ksp7.onrender.com"], // Autoriser uniquement ton site en ligne
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

// Middleware global pour gérer les requêtes OPTIONS manuellement
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

// Middleware pour parser le JSON et les requêtes URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour recevoir les données du formulaire et les stocker
app.post("/submit-form", (req, res) => {
    console.log("Données reçues :", req.body);

    // Lire les réponses existantes ou créer un fichier vide
    let responses = [];
    if (fs.existsSync("responses.json")) {
        const data = fs.readFileSync("responses.json");
        responses = JSON.parse(data);
    }

    // Ajouter la nouvelle réponse
    responses.push(req.body);

    // Sauvegarder dans le fichier
    try {
        fs.writeFileSync("responses.json", JSON.stringify(responses, null, 2));
        console.log("Données sauvegardées dans responses.json");
        res.status(200).json({ message: "Formulaire reçu avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données :", error);
        res.status(500).json({ message: "Erreur lors de la sauvegarde des données." });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
