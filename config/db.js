const mysql = require('mysql2/promise');
require('dotenv').config();

async function connectDB() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'authdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const connection = await pool.getConnection();
    console.log('🟢 Connexion réussie à la base de données !');
    connection.release();

    return pool;
  } catch (err) {
    console.error('🔴 Erreur de connexion à la base de données :', err);
    process.exit(1);
  }
}

module.exports = connectDB;
