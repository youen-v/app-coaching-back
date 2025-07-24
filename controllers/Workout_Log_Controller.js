// controllers/workoutLogController.js
const Workout_Log_Service = require('../services/Workout/Workout_Log');

class Workout_Log_Controller {
    static async create(req, res) {
        try {
            console.log('🔍 Workout log create called with:', JSON.stringify(req.body, null, 2));
            const logData = {
                ...req.body,
                user_id: req.userId  // ✅ Utilisez req.userId partout
            };
            const result = await Workout_Log_Service.log_Workout(logData);
            res.status(201).json(result);
        } catch (error) {
            console.log('❌ Error in workout log create:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const result = await Workout_Log_Service.getWorkoutLog(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

     static async getUserHistory(req, res) {
        try {
            const userId = req.userId;  // ✅ Changé
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const result = await Workout_Log_Service.get_UserWorkout_History(userId, limit, offset);  // ✅ Nom corrigé
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

   static async getExerciseProgress(req, res) {
    try {
        const userId = req.userId;  
        const exerciseId = req.params.exerciseId;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await Workout_Log_Service.get_Exercise_Progress(userId, exerciseId, limit);  // ✅ Nom corrigé
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

    static async getUserStats(req, res) {
        try {
            const userId = req.userId;  // ✅ Changé
            const period = req.query.period || '30d';
            
            const result = await Workout_Log_Service.get_User_Stats(userId, period);  // ✅ Nom corrigé
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
            const result = await Workout_Log_Service.deleteWorkoutLog(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Workout_Log_Controller;