
const Exercise = require('../../model/Exercice_Model');

class Exercise_Service {
    static async Create_Exercice(exerciseData) {
        try {
            
            if (!exerciseData.name || !exerciseData.sport_id) {
                throw new Error('Name and sport_id are required');
            }

            const result = await Exercise.create(exerciseData);
            return {
                success: true,
                data: { id: result.insertId, ...exerciseData }
            };
        } catch (error) {
            throw error;
        }
    }

    static async Get_Exercise_By_Id(id) {
        try {
            const exercise = await Exercise.findById(id);
            if (!exercise) {
                throw new Error('Exercise not found');
            }
            return {
                success: true,
                data: exercise
            };
        } catch (error) {
            throw error;
        }
    }

    static async get_All_Exercises(filters = {}) {
        try {
            const exercises = await Exercise.findAll(filters);
            return {
                success: true,
                data: exercises,
                count: exercises.length
            };
        } catch (error) {
            throw error;
        }
    }

    static async update_Exercise(id, exerciseData) {
        try {
            // Check if exercise exists
            const existing = await Exercise.findById(id);
            if (!existing) {
                throw new Error('Exercise not found');
            }

            const result = await Exercise.update(id, exerciseData);
            return {
                success: true,
                message: 'Exercise updated successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    static async delete_Exercise(id) {
        try {
            // Check if exercise exists
            const existing = await Exercise.findById(id);
            if (!existing) {
                throw new Error('Exercise not found');
            }

            await Exercise.delete(id);
            return {
                success: true,
                message: 'Exercise deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    static async get_Exercises_By_Sport(sportId) {
        try {
            const exercises = await Exercise.findBySportId(sportId);
            return {
                success: true,
                data: exercises,
                count: exercises.length
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Exercise_Service;