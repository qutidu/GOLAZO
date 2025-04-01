const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importer cors

const app = express();
const PORT = 3000;

// Middleware pour activer CORS avec des options spécifiques
app.use(cors({
    origin: "http://127.0.0.1:5500", // Autoriser uniquement cette origine
    methods: ["GET", "POST", "OPTIONS"], // Autoriser ces méthodes
    allowedHeaders: ["Content-Type"], // Autoriser ces en-têtes
    credentials: true, // Autoriser les cookies si nécessaire
}));

// Middleware pour parser le JSON et les requêtes URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour recevoir les données du formulaire
app.post("/submit-form", (req, res) => {
    console.log("Données reçues :", req.body);
    res.status(200).json({ message: "Formulaire reçu avec succès !" });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
