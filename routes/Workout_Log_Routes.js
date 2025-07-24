const express = require('express');
const router = express.Router();
const Workout_Log_Controller = require('../controllers/Workout_Log_Controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/stats/workouts', Workout_Log_Controller.getUserStats);
router.get('/exercises/:exerciseId/progress', Workout_Log_Controller.getExerciseProgress);

router.post('/', Workout_Log_Controller.create);
router.get('/', Workout_Log_Controller.getUserHistory);
router.get('/:id', Workout_Log_Controller.getById);
router.delete('/:id', Workout_Log_Controller.delete);

module.exports = router;