const express = require('express');
const router = express.Router();
const Exercise_Controller = require('../controllers/Exercise_Controller');
const { authenticate } = require('../middlewares/auth'); 

// Route publique SANS authentification
router.get('/exercises/public', Exercise_Controller.getAll);

// Routes protégées AVEC authentification spécifique
router.post('/', authenticate, Exercise_Controller.create);
router.get('/', authenticate, Exercise_Controller.getAll);
router.get('/:id', authenticate, Exercise_Controller.getById);
router.put('/:id', authenticate, Exercise_Controller.update);
router.delete('/:id', authenticate, Exercise_Controller.delete);

router.get('/sports/:sportId/exercises', authenticate, Exercise_Controller.getBySport);

module.exports = router;