
const Program_Service = require('../services//Workout/Program_Service');

class Program_Controller {
    static async create(req, res) {
        try {
            const programData = {
                ...req.body,
                user_id: req.user.id
            };
            const result = await Program_Service.createProgram(programData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_By_Id(req, res) {
        try {
            const result = await Program_Service.getProgramById(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_User_Programs(req, res) {
        try {
            const userId = req.user.id;
            const result = await Program_Service.getUserPrograms(userId);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_Active_Programs(req, res) {
        try {
            const userId = req.user.id;
            const result = await Program_Service.getActivePrograms(userId);
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
            const result = await Program_Service.updateProgram(req.params.id, req.body);
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
            const result = await Program_Service.deleteProgram(req.params.id);
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
            const userId = req.user.id;
            const { name } = req.body;
            const result = await Program_Service.duplicateProgram(req.params.id, userId, name);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Program_Controller;