// Fonction pour afficher le panier 
function afficherPanier() {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    let tableBody = document.getElementById("panier-body");
    let total = 0;

    if (!tableBody) {
        console.error("L'élément avec l'ID 'panier-body' est introuvable !");
        return;
    }

    tableBody.innerHTML = "";

    panier.forEach((article, index) => {
        let totalArticle = article.prix * article.quantite;
        total += totalArticle;

        let row = `
            <tr>
                <td>
                    <img src="${article.image}" class="img-fluid" style="max-width: 50px;"> <!-- Affiche l'image -->
                    ${article.nom} (Taille: ${article.taille})
                </td>
                <td>
                    <input type="number" class="form-control" value="${article.quantite}" min="1" onchange="modifierQuantite(${index}, this.value)">
                </td>
                <td>€${article.prix.toFixed(2)}</td>
                <td>€${totalArticle.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="supprimerArticle(${index})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById("total").textContent = "Total: €" + total.toFixed(2);
}

// Fonction pour ajouter un article au panier
function ajouterAuPanier(nom, prix, image, taille) {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    // Vérifier si l'article existe déjà dans le panier
    let index = panier.findIndex(article => article.nom === nom && article.taille === taille);

    if (index !== -1) {
        // Si l'article est déjà dans le panier, augmenter la quantité
        panier[index].quantite += 1;
    } else {
        // Sinon, ajouter l'article avec une quantité de 1
        panier.push({
            nom: nom,
            prix: prix,
            image: image, // Assurez-vous que l'image est bien incluse ici
            taille: taille,
            quantite: 1
        });
    }

    // Enregistrer dans le localStorage et mettre à jour l'affichage
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherPanier();
}

// Fonction pour modifier la quantité
function modifierQuantite(index, quantite) {
    let panier = JSON.parse(localStorage.getItem("panier"));
    if (panier && panier[index]) {
        panier[index].quantite = parseInt(quantite);
        localStorage.setItem("panier", JSON.stringify(panier));
        afficherPanier();
    }
}

// Fonction pour supprimer un article
function supprimerArticle(index) {
    let panier = JSON.parse(localStorage.getItem("panier"));
    panier.splice(index, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherPanier();
}

// Fonction pour vider le panier
function viderPanier() {
    localStorage.removeItem("panier");
    afficherPanier();
}

// Charger le panier au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    afficherPanier();

    document.querySelectorAll(".btn-success").forEach(button => {
        button.addEventListener("click", function (event) {
            let card = event.target.closest(".card");
            let nom = card.querySelector(".card-title").textContent;
            let prix = parseFloat(card.querySelector(".prix").textContent.replace("€", ""));
            let image = card.querySelector("img").src;
            let taille = card.querySelector(".taille").value; // Si tu as un select pour les tailles

            ajouterAuPanier(nom, prix, image, taille);
        });
    });

    // Ajouter l'événement pour le bouton "Vider le panier"
    const viderButton = document.getElementById("viderPanierButton");
    if (viderButton) {
        viderButton.addEventListener("click", viderPanier);
    }
});