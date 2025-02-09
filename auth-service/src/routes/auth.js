const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phoneNumber,
      farmName
    } = req.body;

    // Vérifier si l'utilisateur ou l'email existe déjà
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username 
          ? "Nom d'utilisateur déjà utilisé"
          : "Email déjà utilisé"
      });
    }

    // Vérification des champs requis
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email', 'farmName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Champs requis manquants: ${missingFields.join(', ')}`
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phoneNumber,
      farmName,
      role: 'farmer'
    });

    await newUser.save();

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.username,
        role: newUser.role,
        farmName: newUser.farmName
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        farmName: newUser.farmName
      }
    });

  } catch (err) {
    console.error('Erreur d\'inscription:', err);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription',
      details: err.message
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Mot de passe incorrect'
      });
    }

    // Mettre à jour la date de dernière connexion
    user.last_login = new Date();
    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        farmName: user.farmName
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        farmName: user.farmName
      }
    });

  } catch (err) {
    console.error('Erreur de connexion:', err);
    res.status(500).json({
      error: 'Erreur lors de la connexion'
    });
  }
});

router.get('/validate-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({
    error: 'Token manquant'
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(403).json({
      error: 'Token invalide'
    });
  }
});

module.exports = router;