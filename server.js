const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB (remplace par ton URL MongoDB Atlas ou ta connexion locale)
const mongoURI = "mongodb+srv://alfred:<coug>@cluster0.yerknku.mongodb.net/formResponses?retryWrites=true&w=majority"; // Remplace par ta connexion MongoDB
let db, collection;

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

// Connexion à MongoDB avant de démarrer le serveur
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        db = client.db("formResponses");  // Le nom de ta base de données
        collection = db.collection("responses"); // Le nom de la collection
        console.log("Connecté à MongoDB avec succès !");
    })
    .catch((err) => {
        console.error("Erreur de connexion à MongoDB :", err);
    });

// Route pour recevoir les données du formulaire et les stocker dans MongoDB
app.post("/submit-form", (req, res) => {
    console.log("Données reçues :", req.body);

    collection.insertOne(req.body)
        .then(() => {
            res.status(200).json({ message: "Formulaire reçu avec succès !" });
        })
        .catch((err) => {
            console.error("Erreur lors de la sauvegarde des données dans MongoDB :", err);
            res.status(500).json({ message: "Erreur lors de la sauvegarde des données." });
        });
});

// Route pour récupérer les réponses stockées dans MongoDB
app.get("/responses", (req, res) => {
    collection.find().toArray()
        .then((responses) => {
            res.status(200).json(responses);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des données depuis MongoDB :", err);
            res.status(500).json({ message: "Erreur lors de la récupération des données." });
        });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});