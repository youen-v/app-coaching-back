// config/db.js - VERSION CORRIGÉE
const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'projet_annuel',  // ← CHANGÉ: utilisez projet_annuel par défaut
  DB_PORT = 3306
} = process.env;

// Create and export a connection pool synchronously
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Debug: afficher la base utilisée
console.log(`📊 Connexion à la base de données: ${DB_NAME}`);

module.exports = pool;