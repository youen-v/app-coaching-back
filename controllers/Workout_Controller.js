// controllers/workoutController.js
const WorkoutService = require('../services/workoutService');

class Workout_Controller {
    static async create(req, res) {
        try {
            const result = await WorkoutService.createWorkout(req.body);
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
            const userId = req.user.id; // Assuming user is attached to req by auth middleware
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