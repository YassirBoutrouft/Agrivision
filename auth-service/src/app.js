const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à la base de données
const authRoutes = require('./routes/auth'); // Import des routes d'authentification
const cors = require('cors');

dotenv.config();
connectDB();

// Initialisation de l'application
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Middleware pour le parsing des requêtes
app.use(express.json());


// Routes d'authentification
app.use('/auth', authRoutes);

// Route de test pour vérifier que le serveur fonctionne
app.get('/test', (req, res) => {
    res.send('Le serveur fonctionne correctement.');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur interne est survenue.' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
