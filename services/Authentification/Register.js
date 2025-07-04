// routes/register.js - Route d'inscription
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { USERS, DATA_BASE } from '../Communication_Bdd.js';

const router = express.Router();
const JWT_SECRET = 'mon_secret_jwt';


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // On vérifie que l'utilisateur a rempli les champs
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont requis' 
      });
    }
    // On vérifie que le mot de passe correspond aux règles qu'on a établi
    // TODO : 'Mettre les règle de l'anssi'
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le mot de passe doit faire au moins 6 caractères' 
      });
    }

    // Vérifier si email existe déjà
    const existing_User = await USERS.find_By_Email(email);
    if (existing_User) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email déjà utilisé' 
      });
    }

    // Hasher le mot de passe
    const hashed_Password = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const [user_Id] = await DATA_BASE('users').insert({
      username,
      email,
      password: hashed_Password,
      created_at: new Date()
    });

    // Générer token
    const token = jwt.sign({ userId: user_Id, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: { 
        id: user_Id, 
        username, 
        email 
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la création du compte' 
    });
  }
});

export default router;