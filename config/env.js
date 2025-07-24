// config/env.js
require('dotenv').config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'ta_clé_secrète_par_défaut'
};
