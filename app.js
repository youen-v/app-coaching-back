const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes API (POST /login, /register, etc.)
app.use('/', authRoutes);

// Middleware d'erreur
app.use(errorHandler);

module.exports = app;
