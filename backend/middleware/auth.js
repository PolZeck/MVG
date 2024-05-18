const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extraction du token JWT de l'en-tête Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        
        // Vérification et décodage du token JWT pour obtenir l'ID de l'utilisateur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        
        // Attribution de l'ID de l'utilisateur à l'objet req.auth
        req.auth = {
            userId: userId,
        };
        
        next();
    } catch (error) {
        
        res.status(401).json({ error });
    }
};
