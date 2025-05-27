document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll('.btn-info'); // Cible tous les boutons "Acheter"
    const modalTitle = document.getElementById('maillotModalLabel');
    const modalImage = document.getElementById('maillotModalImage'); // Cible l'image dans le modal

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Trouver la carte associée au bouton cliqué
            const card = button.closest('.card');

            if (!card) {
                console.error("Impossible de trouver la carte parente !");
                return;
            }

            // Pré-remplir les informations dans le modal
            const title = card.querySelector(".card-title").textContent;
            const image = card.querySelector("img").src;

            modalTitle.textContent = title; // Met à jour le titre du modal
            if (modalImage) modalImage.src = image; // Met à jour l'image dans le modal
        });
    });

    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const taille = document.getElementById('taille').value;
            const quantite = parseInt(document.getElementById('quantite').value);

            // Validation de la quantité
            if (quantite > 0) {
                const article = {
                    nom: document.getElementById('maillotModalLabel').textContent, // Récupère le titre du modal
                    taille: taille,
                    quantite: quantite,
                    prix: 50, // Exemple de prix
                    image: modalImage.src // Récupère l'image du modal
                };

                // Récupérer le panier existant dans localStorage
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                
                // Ajouter l'article au panier
                panier.push(article);
                
                // Mettre à jour le panier dans localStorage
                localStorage.setItem("panier", JSON.stringify(panier));

                // Afficher le message de confirmation
                const confirmationMessage = document.getElementById('confirmationMessage');
                if (confirmationMessage) {
                    confirmationMessage.classList.remove('d-none');

                    // Cacher le message après 3 secondes
                    setTimeout(() => {
                        confirmationMessage.classList.add('d-none');
                    }, 3000);
                }

                // Fermer la modal après 3 secondes
                const modal = document.getElementById('maillotModal');
                if (modal) {
                    setTimeout(() => {
                        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
                        bootstrapModal.hide(); // Ferme la modal
                    }, 3000); // Attendre 3 secondes avant de fermer
                }
            } else {
                alert('Veuillez sélectionner une quantité valide.');
            }
        });
    }
});

