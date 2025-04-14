require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware pour activer CORS
app.use(cors({
    origin: ["https://golazo2.onrender.com"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));


// Middleware global pour gérer les requêtes OPTIONS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://golazo2.onrender.com");
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

const path = require("path");

// Servir les fichiers statiques du dossier actuel (où accueil.html est situé)
app.use(express.static(__dirname));

// Connexion à MongoDB avec Mongoose
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connecté à MongoDB avec succès via Mongoose !"))
    .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));

// Exemple de modèle Mongoose pour enregistrer une commande
const CommandeSchema = new mongoose.Schema({
    email: String,
    prenom: String,
    nom: String,
    adresse: String,
    telephone: String,
    panier: [
        {
            nom: String,
            taille: String,
            quantite: Number,
            prix: Number,
            image: String
        }
    ]
}, { timestamps: true });

const Commande = mongoose.model("Commande", CommandeSchema);

// Route POST pour enregistrer une commande
app.post("/soumettre-commande", async (req, res) => {
    try {
        const { email, prenom, nom, adresse, telephone, panier } = req.body;

        // Créer un nouveau document pour la commande
        const newCommande = new Commande({
            email,
            prenom,
            nom,
            adresse,
            telephone,
            panier,
        });

        await newCommande.save();
        console.log("📩 Commande enregistrée :", req.body);

        res.status(200).json({ message: "✅ Commande reçue avec succès !" });
    } catch (err) {
        console.error("❌ Erreur lors de l'enregistrement de la commande :", err);
        res.status(500).json({ message: "❌ Une erreur est survenue." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "accueil.html"));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
