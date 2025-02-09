const axios = require('axios');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Token manquant');
  }

  try {
    // Vérification du token via le microservice d'authentification
    const response = await axios.get(process.env.AUTH_SERVICE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    req.user = response.data; // Ajoute les données utilisateur au `req`
    next();
  } catch (error) {
    res.status(403).send('Token invalide ou expiré');
  }
};

module.exports = authenticate;
