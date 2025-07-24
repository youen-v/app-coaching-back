// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const { loginUser, registerUser } = require('../controllers/authControllers');

// Inscription
router.post('/register', registerUser);

// Connexion
router.post('/login',loginUser);

module.exports = router;
