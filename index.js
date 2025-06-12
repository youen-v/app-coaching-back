require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

connectDB(); // Pour l’instant, affiche un message

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lancée sur http://localhost:${PORT}`));
