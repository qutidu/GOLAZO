const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware pour traiter les données JSON et les données de formulaire
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour recevoir les données du formulaire
app.post("/submit-form", (req, res) => {
    const { email, prenom, nom, adresse, telephone, panier } = req.body;

    console.log("Données reçues :");
    console.log("Email :", email);
    console.log("Prénom :", prenom);
    console.log("Nom :", nom);
    console.log("Adresse :", adresse);
    console.log("Téléphone :", telephone);
    console.log("Panier :", panier);

    // Répondre au client
    res.status(200).send("Formulaire reçu avec succès !");
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://lo
        calhost:${PORT}`);
});