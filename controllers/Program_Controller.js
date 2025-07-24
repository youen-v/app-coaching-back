const Program_Service = require('../services/Workout/Program_Service');

class Program_Controller {
    static async create(req, res) {
        try {
            const programData = {
                ...req.body,
                user_id: req.userId 
            };
            const result = await Program_Service.Create(programData); 
            
            const createdProgram = await Program_Service.find_By_Id(result.insertId);
            
            res.status(201).json({
                success: true,
                data: createdProgram
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_By_Id(req, res) {
        try {
            const result = await Program_Service.find_By_Id(req.params.id); // Nom de méthode corrigé
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Programme non trouvé'
                });
            }
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_User_Programs(req, res) {
        try {
            const userId = req.userId; // Changé de req.user.id à req.userId
            const result = await Program_Service.find_By_User_Id(userId); // Nom de méthode corrigé
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async get_Active_Programs(req, res) {
        try {
            const userId = req.userId; 
            const result = await Program_Service.get_Active_Programs(userId);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const result = await Program_Service.update(req.params.id, req.body);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Programme non trouvé'
                });
            }
            
            // Récupérer le programme mis à jour
            const updatedProgram = await Program_Service.find_By_Id(req.params.id);
            
            res.json({
                success: true,
                data: updatedProgram
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const result = await Program_Service.delete(req.params.id);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Programme non trouvé'
                });
            }
            
            res.json({
                success: true,
                message: 'Programme supprimé avec succès'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async duplicate(req, res) {
        try {
            const userId = req.userId; // Changé de req.user.id à req.userId
            const { name } = req.body;
            
            // Récupérer le programme original
            const originalProgram = await Program_Service.find_By_Id(req.params.id);
            
            if (!originalProgram) {
                return res.status(404).json({
                    success: false,
                    message: 'Programme original non trouvé'
                });
            }
            
            // Créer une copie
            const duplicateData = {
                user_id: userId,
                name: name || `${originalProgram.name} (Copie)`,
                goal: originalProgram.goal
            };
            
            const result = await Program_Service.Create(duplicateData);
            const duplicatedProgram = await Program_Service.find_By_Id(result.insertId);
            
            res.status(201).json({
                success: true,
                data: duplicatedProgram
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Program_Controller;