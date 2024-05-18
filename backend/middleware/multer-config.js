// Importation du module multer
const multer = require('multer');

// Types MIME autorisés avec leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
    // Définition du dossier de destination des fichiers
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Génération du nom de fichier unique
    filename: (req, file, callback) => {
        // Suppression des espaces dans le nom d'origine
        const name = file.originalname.split(' ').join('_');
        // Récupération de l'extension du fichier à partir de son type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Construction du nom de fichier final avec l'extension et un horodatage
        callback(null, name + '_' + Date.now() + '.' + extension);
    },
});

const upload = multer({
    // Utilisation de la configuration de stockage définie ci-dessus
    storage: storage,
    // Filtrage des types de fichiers autorisés
    fileFilter: (req, file, callback) => {
        // Vérification si le type MIME du fichier est autorisé
        if (MIME_TYPES[file.mimetype]) {
            // Si autorisé, appel du callback avec true pour accepter le fichier
            callback(null, true);
        } else {
            // Si non autorisé, appel du callback avec une erreur
            callback(new Error('Type de fichier invalide !'));
        }
    },
});

// Exportation du middleware multer configuré pour gérer le téléchargement d'un seul fichier
module.exports = upload.single('image');
