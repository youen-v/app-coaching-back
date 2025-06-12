
const users = [
    { id: 1, email: 'test@mail.com', password: '123456' }
  ];
  
  exports.login = ({ email, password }) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Identifiants invalides');
    return { message: 'Connexion réussie', user };
  };
  
  exports.register = ({ email, password }) => {
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('Utilisateur déjà existant');
    const newUser = { id: Date.now(), email, password };
    users.push(newUser);
    return { message: 'Inscription réussie', user: newUser };
  };
  