// services/Authentification/authServices.js - VERSION CORRIGÉE AVEC MYSQL
const bcrypt = require('bcryptjs');
const { BadRequestError, UnauthorizedError } = require('../../utils/errors');
const db = require('../../config/db'); // Ajout de l'import de la base de données



exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError('Email et mot de passe requis');
  }

  try {
    // Chercher l'utilisateur dans la base de données MySQL
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.execute(query, [email]);
    
    if (users.length === 0) {
      throw new UnauthorizedError('Utilisateur introuvable');
    }
    
    const user = users[0];
    
    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Mot de passe incorrect');
    }

    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  } catch (error) {
    // Re-throw les erreurs personnalisées
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      throw error;
    }
    // Log les erreurs de base de données
    console.error('Erreur DB dans login:', error);
    throw new Error('Erreur interne du serveur');
  }
};

exports.register = async ({ email, password, name }) => {
  if (!email || !password) {
    throw new BadRequestError('Email et mot de passe requis');
  }

  try {
    // Vérifier si l'utilisateur existe déjà dans MySQL
    const checkQuery = 'SELECT id FROM users WHERE email = ?';
    const [existingUsers] = await db.execute(checkQuery, [email]);
    
    if (existingUsers.length > 0) {
      throw new BadRequestError('Cet utilisateur existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insérer le nouvel utilisateur dans MySQL
    const insertQuery = `
      INSERT INTO users (email, password, username, created_at) 
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.execute(insertQuery, [email, hashedPassword, name || 'User']);
    
    const newUser = {
      id: result.insertId,
      email: email,
      username: name || 'User'
    };

    return {
      message: 'Inscription réussie',
      user: newUser
    };
  } catch (error) {
    // Re-throw les erreurs personnalisées
    if (error instanceof BadRequestError) {
      throw error;
    }
    // Log les erreurs de base de données
    console.error('Erreur DB dans register:', error);
    throw new Error('Erreur interne du serveur');
  }
};