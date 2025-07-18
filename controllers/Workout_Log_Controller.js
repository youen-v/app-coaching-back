// controllers/workoutLogController.js
const WorkoutLogService = require('../services/workoutLogService');

class Workout_Log_Controller {
    static async create(req, res) {
        try {
            const logData = {
                ...req.body,
                user_id: req.user.id 
            };
            const result = await WorkoutLogService.logWorkout(logData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const result = await WorkoutLogService.getWorkoutLog(req.params.id);
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
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const result = await WorkoutLogService.getUserWorkoutHistory(userId, limit, offset);
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
            const userId = req.user.id;
            const exerciseId = req.params.exerciseId;
            const limit = parseInt(req.query.limit) || 10;
            
            const result = await WorkoutLogService.getExerciseProgress(userId, exerciseId, limit);
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
            const userId = req.user.id;
            const period = req.query.period || '30d';
            
            const result = await WorkoutLogService.getUserStats(userId, period);
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
            const result = await WorkoutLogService.deleteWorkoutLog(req.params.id);
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