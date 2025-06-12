const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authControllers');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/ping', (req, res) => {
  res.send('API Auth opérationnelle');
});


module.exports = router;
