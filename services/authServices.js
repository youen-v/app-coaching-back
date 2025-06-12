const bcrypt = require('bcrypt');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

const users = [];

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError('Email et mot de passe requis');
  }

  const user = users.find(u => u.email === email);
  if (!user) throw new UnauthorizedError('Utilisateur introuvable');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new UnauthorizedError('Mot de passe incorrect');

  return {
    message: 'Connexion réussie',
    user
  };
};

exports.register = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError('Email et mot de passe requis');
  }

  const exists = users.find(u => u.email === email);
  if (exists) throw new BadRequestError('Cet utilisateur existe déjà');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword
  };
  users.push(newUser);

  return {
    message: 'Inscription réussie',
    user: newUser
  };
};
