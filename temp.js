// Script à exécuter dans Node.js pour générer le hash
// Créez un fichier temp.js avec ce contenu et exécutez: node temp.js

const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'secret123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash pour secret123:');
    console.log(hash);
    
    // Test que ça marche
    const isValid = await bcrypt.compare('secret123', hash);
    console.log('Vérification:', isValid ? 'OK' : 'ERREUR');
}

generateHash();