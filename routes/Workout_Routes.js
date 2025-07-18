
const express = require('express');
const router = express.Router();
const Workout_Controller = require('../controllers/Workout_Controller');
const { authenticate } = require('../middlewares/auth');


router.use(authenticate);


router.post('/workouts', Workout_Controller.create);
router.get('/workouts/:id', Workout_Controller.getById);
router.put('/workouts/:id', Workout_Controller.update);
router.delete('/workouts/:id', Workout_Controller.delete);


router.get('/programs/:programId/workouts', Workout_Controller.getByProgram);


router.get('/workouts/upcoming', Workout_Controller.getUpcoming);

// Duplicate a workout
router.post('/workouts/:id/duplicate', Workout_Controller.duplicate);

module.exports = router;