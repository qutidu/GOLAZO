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
                    prix: 50, // Exemple de prix, tu peux le modifier
                   
                };

                // Ajout dans le panier (localStorage)
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                panier.push(article);
                localStorage.setItem("panier", JSON.stringify(panier));

                // Afficher le message de confirmation
                if (confirmationMessage) {
                    confirmationMessage.classList.remove('d-none');
                    setTimeout(() => {
                        confirmationMessage.classList.add('d-none');
                    }, 3000);
                }

                // Cacher le modal après ajout au panier
                if (modal) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modal);
                    bootstrapModal.hide();
                }
            } else {
                alert('Veuillez sélectionner une quantité valide.');
            }
        });
    } else {
        console.error("Le bouton 'Ajouter au panier' est introuvable !");
    }
});
