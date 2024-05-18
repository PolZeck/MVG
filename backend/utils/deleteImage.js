const fs = require('fs');// Importation du module 'fs' (file system) pour la gestion des fichiers

const path = require('path'); // Importation du module 'path' pour la gestion des chemins de fichiers

const deleteImage = (imageUrl) => {
    // Vérification si l'URL de l'image est définie
    if (!imageUrl) return;

    // Extraction du nom de fichier à partir de l'URL de l'image
    const filename = imageUrl.split('/images/')[1];
    // Construction du chemin absolu de l'image à supprimer
    const imagePath = path.join(__dirname, '..', 'images', filename);

    // Suppression du fichier correspondant à l'image
    fs.unlink(imagePath, (error) => {
        if (error) {
            console.error("erreur dans la suppression de l'image:", error);
        }
    });
};

// Exportation de la fonction deleteImage pour qu'elle soit utilisable dans d'autres modules
module.exports = deleteImage;
