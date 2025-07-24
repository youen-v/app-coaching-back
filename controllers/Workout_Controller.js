// controllers/Workout_Controller.js
const WorkoutService = require('../services/Workout/Workout');

class Workout_Controller {
    static async create(req, res) {
        try {
            console.log('Create workout with data:', req.body);
            const result = await WorkoutService.createWorkout(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // AJOUTÉ: Méthode pour lister tous les workouts (avec filtrage optionnel)
   static async getAll(req, res) {
    try {
        console.log('🔍 getAll - userId from token:', req.userId);
        
        const { programId } = req.query;
        console.log('🔍 programId from query:', programId); // AJOUTEZ
        
        let result;
        console.log('🔍 About to check if condition'); // AJOUTEZ
        
        if (programId) {
            console.log('🔍 Taking programId branch'); // AJOUTEZ
            result = await WorkoutService.getWorkoutsByProgram(programId);
        } else {
            console.log('🔍 Taking userId branch'); // AJOUTEZ
            const userId = req.userId;
            console.log('🔍 Calling getUserWorkouts with:', userId);
            result = await WorkoutService.getUserWorkouts(userId);
            console.log('🔍 getUserWorkouts completed'); // AJOUTEZ
        }
        
        console.log('🔍 About to send response'); // AJOUTEZ
        res.json(result);
        console.log('🔍 Response sent'); // AJOUTEZ
    } catch (error) {
        console.log('❌ Error in getAll:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

    static async getById(req, res) {
        try {
            const result = await WorkoutService.getWorkoutById(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getByProgram(req, res) {
        try {
            const result = await WorkoutService.getWorkoutsByProgram(req.params.programId);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getUpcoming(req, res) {
        try {
            const days = req.query.days || 7;
            const userId = req.userId; // Corrigé: req.userId au lieu de req.user.id
            const result = await WorkoutService.getUpcomingWorkouts(userId, days);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const result = await WorkoutService.updateWorkout(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const result = await WorkoutService.deleteWorkout(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async duplicate(req, res) {
        try {
            const result = await WorkoutService.duplicateWorkout(req.params.id, req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Workout_Controller;