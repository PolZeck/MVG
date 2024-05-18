const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port en un nombre ou une chaîne
const normalizePort = (val) => {
    const port = parseInt(val, 10); 

    if (isNaN(port)) {
        return val; // Retourne la valeur originale si elle n'est pas un nombre
    }
    if (port >= 0) {
        return port; // Retourne la valeur du port si elle est valide
    }
    return false; // Retourne false pour les valeurs de port invalides
};

// Récupération du port à partir des variables d'environnement ou utilisation du port 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
// Configuration du port dans l'application Express
app.set('port', port);

// Fonction pour gérer les erreurs de démarrage du serveur
const errorHandler = (error) => {
    // Vérification si l'erreur n'est pas liée à l'écoute du serveur
    if (error.syscall !== 'listen') {
        throw error; // Lève une erreur si ce n'est pas une erreur d'écoute
    }
    // Récupération de l'adresse et du port du serveur
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    // Gestion des différents types d'erreurs
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.'); // Port nécessitant des privilèges élevés
            process.exit(1); // Quitte le processus avec un code d'erreur
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.'); // Port déjà utilisé
            process.exit(1); // Quitte le processus avec un code d'erreur
            break;
        default:
            throw error; // Lève une erreur pour les autres types d'erreurs
    }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Écouteur d'événement pour gérer les erreurs de démarrage du serveur
server.on('error', errorHandler);
// Écouteur d'événement pour afficher un message lorsque le serveur démarre avec succès
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind); // Affiche l'adresse sur laquelle le serveur écoute
});

server.listen(port);
