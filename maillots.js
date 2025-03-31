document.addEventListener("DOMContentLoaded", function () {
    const addToCartButton = document.getElementById('addToCartButton');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const modal = document.getElementById('maillotModal');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const taille = document.getElementById('taille').value;
            const quantite = parseInt(document.getElementById('quantite').value);

            // Validation de la quantité
            if (quantite > 0) {
                const article = {
                    nom: "Maillot",
                    taille: taille,
                    quantite: quantite,
                    prix: 50, // Exemple de prix
                };

                // Récupérer le panier existant dans localStorage
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                
                // Ajouter l'article au panier
                panier.push(article);
                
                // Mettre à jour le panier dans localStorage
                localStorage.setItem("panier", JSON.stringify(panier));

                // Afficher le message de confirmation
                if (confirmationMessage) {
                    confirmationMessage.classList.remove('d-none');

                    // Cacher le message après 6 secondes
                    setTimeout(() => {
                        confirmationMessage.classList.add('d-none');
                    }, 3000);
                }

                // Fermer la modal après 5 secondes
                if (modal) {
                    setTimeout(() => {
                        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
                        bootstrapModal.hide();
                    }, 3000); // Ferme la modal après 5 secondes
                }
            } else {
                alert('Veuillez sélectionner une quantité valide.');
            }
        });
    } else {
        console.error("Le bouton 'Ajouter au panier' est introuvable !");
    }
});

