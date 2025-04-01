const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Utiliser le port Render si dispo

// Middleware pour activer CORS avec la bonne origine
app.use(cors({
    origin: ["https://golazo-ksp7.onrender.com"], // Autoriser uniquement ton site en ligne
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

// Middleware pour parser le JSON et les requêtes URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware global pour gérer les requêtes OPTIONS manuellement
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://golazo-ksp7.onrender.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // Répond immédiatement aux pré-requêtes
    }
    next();
});

// Route pour recevoir les données du formulaire
app.post("/submit-form", (req, res) => {
    console.log("Données reçues :", req.body);
    res.status(200).json({ message: "Formulaire reçu avec succès !" });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});