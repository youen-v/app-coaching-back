// controllers/exerciseController.js
const ExerciseService = require('../services/Workout/Exercise');

class ExerciseController {
  // GET /api/exercises/public  (route publique)
  static async getAllPublic(req, res, next) {
    try {
      const result = await ExerciseService.getAllExercises();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET /api/exercises          (route protégée)
  static async getAll(req, res, next) {
    try {
      const result = await ExerciseService.getAllExercises();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // POST /api/exercises
  static async create(req, res, next) {
    console.log('Exercise create method reached!', req.body); 
    try {
      const result = await ExerciseService.createExercise(req.body);
      return res.status(201).json(result);
    } catch (err) {
      console.error('Error creating exercise:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET /api/exercises/:id
  static async getById(req, res, next) {
    try {
      const result = await ExerciseService.getExerciseById(req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  }

  // PUT /api/exercises/:id
  static async update(req, res, next) {
    try {
      const result = await ExerciseService.updateExercise(req.params.id, req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/exercises/:id
  static async delete(req, res, next) {
    try {
      const result = await ExerciseService.deleteExercise(req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET /api/sports/:sportId/exercises
  static async getBySport(req, res, next) {
    try {
      const result = await ExerciseService.getExercisesBySport(req.params.sportId);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = ExerciseController;
