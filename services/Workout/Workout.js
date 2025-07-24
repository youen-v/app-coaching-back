// services/Workout/Workout.js
const Workout_Model = require('../../model/Workout_Model'); // Corrigé le chemin
const db = require('../../config/db');

class Workout_Service {
    static async createWorkout(workoutData) {
        try {
            const workoutResult = await Workout_Model.create(workoutData);
            const workoutId = workoutResult.insertId;
            
            // Récupérer le workout créé pour retourner les données complètes
            const createdWorkout = await Workout_Model.find_By_Id(workoutId);
            
            return {
                success: true,
                data: createdWorkout
            };
        } catch (error) {
            throw new Error(`Erreur lors de la création du workout: ${error.message}`);
        }
    }

    static async getWorkoutById(id) {
        try {
            const workout = await Workout_Model.get_With_Exercises(id);
            if (!workout) {
                throw new Error('Workout not found');
            }
            return {
                success: true,
                data: workout
            };
        } catch (error) {
            throw error;
        }
    }

    static async getWorkoutsByProgram(programId) {
    try {
        console.log('getWorkoutsByProgram called with programId:', programId); // AJOUTEZ
        const workouts = await Workout_Model.find_By_ProgramId(programId);
        console.log('Found', workouts.length, 'workouts for program', programId); // AJOUTEZ
        if (workouts.length > 0) {
            console.log('First workout:', JSON.stringify(workouts[0], null, 2)); // AJOUTEZ
        }
        return {
            success: true,
            data: workouts,
            count: workouts.length
        };
    } catch (error) {
        console.log('Error in getWorkoutsByProgram:', error); // AJOUTEZ
        throw error;
    }
}

    // AJOUTÉ: Méthode pour récupérer tous les workouts d'un utilisateur
    static async getUserWorkouts(userId) {
        try {
            const query = `
                SELECT w.*, p.name as program_name, s.name as sport_name, p.user_id
                FROM workouts w
                JOIN programs p ON w.program_id = p.id
                LEFT JOIN sports s ON w.sport_id = s.id
                WHERE p.user_id = ?
                ORDER BY w.scheduled_on DESC, w.position
            `;
            const [workouts] = await db.execute(query, [userId]);
            
            return {
                success: true,
                data: workouts,
                count: workouts.length
            };
        } catch (error) {
            throw error;
        }
    }

    static async getUpcomingWorkouts(userId, days = 7) {
        try {
            const workouts = await Workout_Model.find_Up_Coming(userId, days); // Corrigé le nom
            return {
                success: true,
                data: workouts,
                count: workouts.length
            };
        } catch (error) {
            throw error;
        }
    }

    static async updateWorkout(id, workoutData) {
        try {
            const existing = await Workout_Model.find_By_Id(id); // Corrigé le nom
            if (!existing) {
                throw new Error('Workout not found');
            }

            await Workout_Model.update(id, workoutData);
            
            // Récupérer le workout mis à jour
            const updatedWorkout = await Workout_Model.find_By_Id(id);
            
            return {
                success: true,
                data: updatedWorkout
            };
        } catch (error) {
            throw error;
        }
    }

    static async deleteWorkout(id) {
        try {
            const existing = await Workout_Model.find_By_Id(id); // Corrigé le nom
            if (!existing) {
                throw new Error('Workout not found');
            }

            await Workout_Model.delete(id);
            return {
                success: true,
                message: 'Workout deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    static async duplicateWorkout(workoutId, newData) {
        try {
            const original = await Workout_Model.get_With_Exercises(workoutId);
            if (!original) {
                throw new Error('Original workout not found');
            }

            // Créer le nouveau workout
            const workoutData = {
                program_id: newData.program_id || original.program_id,
                sport_id: newData.sport_id || original.sport_id,
                name: newData.name || `${original.name} (Copy)`,
                scheduled_on: newData.scheduled_on || original.scheduled_on,
                position: newData.position || original.position
            };

            return await this.createWorkout(workoutData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Workout_Service;