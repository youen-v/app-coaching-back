const express = require('express');
const router = express.Router();
const Workout_Controller = require('../controllers/Workout_Controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

// AJOUTEZ CETTE LIGNE MANQUANTE :
router.get('/', Workout_Controller.getAll);

// Routes existantes
router.post('/', Workout_Controller.create);
router.get('/upcoming', Workout_Controller.getUpcoming);
router.get('/:id', Workout_Controller.getById);
router.put('/:id', Workout_Controller.update);
router.delete('/:id', Workout_Controller.delete);
router.post('/:id/duplicate', Workout_Controller.duplicate);

// Route par programme
router.get('/programs/:programId/workouts', Workout_Controller.getByProgram);

module.exports = router;