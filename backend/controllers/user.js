const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        // Hashage du mot de passe fourni par l'utilisateur
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        });

        // Sauvegarde du nouvel utilisateur dans la base de données
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        res.status(500).json({ error });
    }
};


exports.login = async (req, res) => {
    try {
        // Recherche de l'utilisateur dans la base de données par son email
        const user = await User.findOne({ email: req.body.email });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(401).json({
                message: 'Paire login/mot de passe incorrecte',
            });
        }

        // Vérification de la validité du mot de passe fourni par l'utilisateur
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        // Si le mot de passe est invalide
        if (!validPassword) {
            return res.status(401).json({
                message: 'Paire login/mot de passe incorrecte',
            });
        }

        // Si l'authentification réussit, génère un token JWT contenant l'ID de l'utilisateur
        // et le signe avec une clé secrète, avec une expiration de 24 heures
        const token = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h',
        });

        res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
