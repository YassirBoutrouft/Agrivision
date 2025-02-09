const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/files');
const cors = require("cors");
const path = require('path');
const fs = require('fs');

dotenv.config();
connectDB();

const app = express();

// 🔹 Définition du chemin de stockage avec une variable d'environnement
const STORAGE_PATH = process.env.STORAGE_PATH || '/home/user/AgroStorage';

// Vérifier si le dossier de stockage existe, sinon le créer
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Configuration de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());

// 🔹 Adapter le chemin pour servir les fichiers statiques
app.use('/files', express.static(STORAGE_PATH));
app.use('/files', fileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Service de gestion des fichiers démarré sur le port ${PORT}`));
