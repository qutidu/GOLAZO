document.addEventListener("DOMContentLoaded", function () {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    const recapPanier = document.getElementById("recap-panier");
    const sousTotalElement = document.getElementById("sous-total");
    const fraisExpeditionElement = document.getElementById("frais-expedition");
    const totalElement = document.getElementById("total");

    let sousTotal = 0;
    const fraisExpedition = 5.00; // Exemple de frais fixes

    // Afficher les articles du panier
    panier.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("d-flex", "justify-content-between", "mb-2");
        articleElement.innerHTML = `
            <div>
                <img src="${article.image}" alt="${article.nom}" style="width: 50px; height: auto; margin-right: 10px;">
                ${article.nom} (Taille: ${article.taille}, Quantité: ${article.quantite})
            </div>
            <div>€${(article.prix * article.quantite).toFixed(2)}</div>
        `;
        recapPanier.appendChild(articleElement);

        sousTotal += article.prix * article.quantite;
    });

    // Calculer et afficher les totaux
    sousTotalElement.textContent = `€${sousTotal.toFixed(2)}`;
    totalElement.textContent = `€${(sousTotal + fraisExpedition).toFixed(2)}`;
    fraisExpeditionElement.textContent = `€${fraisExpedition.toFixed(2)}`;

    // Gestion du bouton "Enregistrer et continuer"
    const confirmerCommandeButton = document.getElementById("confirmer-commande");
    confirmerCommandeButton.addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const prenom = document.getElementById("prenom").value;
        const nom = document.getElementById("nom").value;
        const adresse = document.getElementById("adresse").value;
        const telephone = document.getElementById("telephone").value;
        const panier = JSON.parse(localStorage.getItem("panier")) || [];

        fetch("https://golazo-ksp7.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                prenom,
                nom,
                adresse,
                telephone,
                panier,
            }),
        })
            .then(response => {
                if (response.ok) {
                    alert("Commande confirmée ! Merci pour votre achat.");
                    localStorage.removeItem("panier"); // Vider le panier après confirmation
                    window.location.href = "accueil.html"; // Rediriger vers la page d'accueil
                } else {
                    alert("Une erreur est survenue lors de la soumission du formulaire.");
                }
            })
            .catch(error => {
                console.error("Erreur :", error);
                alert("Impossible de soumettre le formulaire. Veuillez réessayer plus tard.");
            });
    });
});