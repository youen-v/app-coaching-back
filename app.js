const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route GET /login pour servir le formulaire HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Routes API (POST /login, /register, etc.)
app.use('/', authRoutes);

// Middleware d'erreur
app.use(errorHandler);

module.exports = app;
