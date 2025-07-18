
const express = require('express');
const router = express.Router();
const Workout_Log_Controller = require('../controllers/Workout_Log_Controller');
const { authenticate } = require('../middlewares/auth');


router.use(authenticate);


router.post('/workout-logs', Workout_Log_Controller.create);


router.get('/workout-logs/:id', Workout_Log_Controller.getById);


router.get('/workout-logs', Workout_Log_Controller.getUserHistory);


router.get('/exercises/:exerciseId/progress', Workout_Log_Controller.getExerciseProgress);


router.get('/stats/workouts', Workout_Log_Controller.getUserStats);


router.delete('/workout-logs/:id', Workout_Log_Controller.delete);

module.exports = router;