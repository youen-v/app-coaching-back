// controllers/authControllers.js
const jwt = require('jsonwebtoken');
const authService = require('../services/Authentification/authServices');
const { JWT_SECRET } = require('../config/env');

/**
 * Controller to handle user login
 */
exports.loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    if (result.user) {
      const { id, email } = result.user;

      // Generate JWT token
      const token = jwt.sign(
        { sub: id, email },       // payload
        JWT_SECRET,               // secret key
        { expiresIn: '1h' }       // token expiration
      );

      return res.status(200).json({
        success: true,
        message: result.message || 'Connexion réussie',
        user: { id, email },
        token
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle user registration
 */
exports.registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    if (result.user) {
      const { id, email } = result.user;
      return res.status(201).json({
        success: true,
        message: result.message || 'Inscription réussie',
        user: { id, email }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Erreur lors de l’inscription'
      });
    }
  } catch (error) {
    next(error);
  }
};
