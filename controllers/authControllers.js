const authService = require('../services/Authentification/authServices');

exports.loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    // Nettoyage de la réponse utilisateur
    if (result.user) {
      const { id, email } = result.user;
      res.status(200).json({
        message: result.message || 'Connexion réussie',
        user: { id, email }
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides' });
    }

  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    // Nettoyage de la réponse utilisateur
    if (result.user) {
      const { id, email } = result.user;
      res.status(201).json({
        message: result.message || 'Inscription réussie',
        user: { id, email }
      });
    } else {
      res.status(400).json({ message: 'Erreur lors de l’inscription' });
    }

  } catch (error) {
    next(error);
  }
};
