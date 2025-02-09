const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Dataset = require('../models/Dataset');
const authenticate = require('../middleware/auth');

const router = express.Router();

// 🔹 Définition de la variable de base du stockage
const STORAGE_PATH = process.env.STORAGE_PATH || '/home/user/AgroStorage';

// Vérifier si le dossier de stockage existe, sinon le créer
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Configuration de multer pour gérer les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = path.join(STORAGE_PATH, req.user.username);
    const datasetFolder = path.join(userFolder, req.body.dataset || 'default');

    // Créer les répertoires si nécessaire
    if (!fs.existsSync(datasetFolder)) {
      fs.mkdirSync(datasetFolder, { recursive: true });
    }

    cb(null, datasetFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route pour uploader un fichier
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été uploadé' });
    }

    // Normaliser le chemin en remplaçant les backslashes par des forward slashes
    let relativePath = path.relative(STORAGE_PATH, req.file.path);
    relativePath = relativePath.replace(/\\/g, '/');

    // Ajouter un slash au début du chemin s'il n'existe pas
    relativePath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;

    console.log('Chemin relatif normalisé:', relativePath);

    // Ajoutez le chemin relatif à la base de données
    const datasetName = req.body.dataset || 'default';
    const newImage = {
      file_path: relativePath,
      uploaded_at: new Date(),
    };

    const dataset = await Dataset.findOneAndUpdate(
      { owner: req.user.userId, name: datasetName },
      { 
        $push: { images: newImage }, 
        $setOnInsert: { name: datasetName, owner: req.user.userId } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Fichier uploadé avec succès',
      file_path: relativePath,
      dataset: dataset
    });

  } catch (err) {
    console.error('Erreur détaillée:', err);
    res.status(500).json({ 
      error: 'Erreur lors de l\'upload du fichier',
      details: err.message 
    });
  }
});

// Route pour récupérer les images
router.get('/images', authenticate, async (req, res) => {
  try {
    const datasets = await Dataset.find({ owner: req.user.userId });
    const images = datasets.flatMap(dataset =>
      dataset.images.map(image => ({
        id: image._id,
        file_path: image.file_path,
        uploaded_at: image.uploaded_at,
        dataset_name: dataset.name,
      }))
    );

    res.json({ images, total: images.length });
  } catch (err) {
    console.error('Erreur lors de la récupération des images:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des images' });
  }
});

// Route pour servir un fichier spécifique
router.get('/file/:filePath', authenticate, (req, res) => {
  const filePath = req.params.filePath;
  const fullPath = path.join(STORAGE_PATH, filePath);

  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'Fichier introuvable' });
  }
});

module.exports = router;
