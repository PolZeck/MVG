const Book = require('../models/Book')
const deleteImage = require('../utils/deleteImage')

exports.createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book)// on parse la requête pour en faire un objet
        delete bookObject._id
        delete bookObject._userId// on supprime ces propriété pour éviterincohérences car ce sont des champs générés aléatoirement

        const book = new Book({
            ...bookObject, // opérateur spread pour copier les prop de bookObject
            userId: req.auth.userId, // On récup l'objet d'authentification pour garantir que li livre <=> user authentifié
            imageUrl: `${req.protocol}://${req.get('host')}/images/${ // On construit l'URL de l'image en utilisant le protocole 
                req.file.filename
            }`,
        })

        await book.save()

        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.createRating = async (req, res) => {
    try {
        const { userId, rating } = req.body
        const book = await Book.findById(req.params.id)

        if (!req.body) {
            return res
                .status(400)
                .json({ message: 'Votre requête ne contient aucune note !' })
        }

        if (book.ratings.some((rating) => rating.userId === userId)) { 
            return res
                .status(400)
                .json({ message: 'Vous avez déjà noté ce livre !' })
        }

        book.ratings.push({ userId: userId, grade: rating })//On ajoute la nouvelle note à ratings, chaque note étant composée de userId et grade
        const grades = book.ratings.map((rating) => rating.grade)// Extraction des notes
        const average =
            grades.reduce((total, grade) => total + grade, 0) / grades.length// Calcule de la moyenne 
        book.averageRating = parseFloat(average.toFixed(1))// maj de averageRating, et onarrondit 
        await book.save()

        res.status(200).json(book)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

exports.modifyBook = async (req, res) => {
    try {
        const { id } = req.params// extrait l'ID du livre
        const book = await Book.findOne({ _id: id }) // On cherche le livre dans la base de données en utilisant l'id

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé !' })
        }

        if (book.userId != req.auth.userId) {
            return res
                .status(401)
                .json({ message: "Vous n'êtes pas autorisé !" })
        }

        const bookData = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${
                      req.file.filename // nvl image upload -> on parse les données du livre fournies dans le corp de la requête 
                  }`,
              }
            : { ...req.body }

        if (req.file && book.imageUrl) {
            deleteImage(book.imageUrl) // On supprime l'ancienne img si y'en a une nvl
        }

        delete bookData._id
        delete bookData._userId

        await Book.updateOne({ _id: id }, { ...bookData })// on maj le livre avec les nouvelles données

        res.status(200).json({ message: 'Livre modifié avec succès !' })
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.deleteBook = async (req, res) => {
    try {
        // Extraction de l'ID du livre à partir des paramètres de la requête
        const { id } = req.params;
        
        // Recherche et suppression du livre dans la base de données
        // Vérifie que l'ID du livre et l'ID de l'utilisateur authentifié correspondent
        const book = await Book.findOneAndDelete({
            _id: id,
            userId: req.auth.userId,
        });

        // Si le livre n'est pas trouvé, renvoie un statut 401 (Unauthorized)
        if (!book) {
            return res.status(401).json({ message: 'Livre non trouvé !' });
        }

        // Si le livre a une image associée, supprime l'image du serveur
        if (book.imageUrl) {
            deleteImage(book.imageUrl);
        }

        res.status(200).json({ message: 'Objet supprimé !' });
    } catch (error) {
        res.status(500).json({ error });
    }
};


exports.getOneBook = async (req, res) => {
    try {
        // Recherche du livre dans la base de données à partir de l'ID fourni dans les paramètres de la requête
        const book = await Book.findOne({ _id: req.params.id });

        // Si le livre n'est pas trouvé, renvoie un statut 404 (Not Found)
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé !' });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error });
    }
};


exports.getBestBooks = async (req, res) => {
    try {
        // Utilisation de l'agrégation MongoDB pour calculer les meilleures notes
        const books = await Book.aggregate([
            {
                // Projette les champs nécessaires et calcule la moyenne des notes
                $project: {
                    title: 1, 
                    imageUrl: 1, 
                    author: 1, 
                    year: 1, 
                    genre: 1, 
                    averageRating: { $avg: '$ratings.grade' }, // Calculer la moyenne des notes
                },
            },
            {
                // Trier les livres par note moyenne décroissante
                $sort: { averageRating: -1 },
            },
            {
                // Limiter les résultats aux 3 meilleurs livres
                $limit: 3,
            },
        ]);

        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ error });
    }
};


exports.getAllBooks = async (req, res) => {
    try {
        // Recherche de tous les documents dans la collection Book
        const books = await Book.find()
        // Réponse de succès avec un statut 200 (OK) et la liste de tous les livres
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error })
    }
}
