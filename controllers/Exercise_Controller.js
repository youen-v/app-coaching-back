// controllers/exerciseController.js
const Exercise_Service = require('../services/Workout/Exercise');

class Exercise_Controller {
    static async create(req, res) {
        try {
            const result = await Exercise_Service.createExercise(req.body);
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
            const result = await Exercise_Service.getExerciseById(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const filters = {
                sport_id: req.query.sport_id,
                search: req.query.search
            };
            const result = await Exercise_Service.getAllExercises(filters);
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
            const result = await Exercise_Service.updateExercise(req.params.id, req.body);
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
            const result = await Exercise_Service.deleteExercise(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getBySport(req, res) {
        try {
            const result = await Exercise_Service.getExercisesBySport(req.params.sportId);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Exercise_Controller;