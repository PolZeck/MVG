// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Importation des routes pour les livres et les utilisateurs
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// Connexion à la base de données MongoDB
mongoose
    .connect(
        'mongodb+srv://paulledieu:baadkUHNUKbqZJld@cluster0.q6weriy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !')) 
    .catch(() => console.log('Connexion à MongoDB échouée !')); 

// Création de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    // Autoriser les requêtes depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Autoriser certains en-têtes dans les requêtes
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    // Autoriser certaines méthodes HTTP dans les requêtes
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

// Routes pour les livres et les utilisateurs
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express
module.exports = app;
