// services/workoutService.js
const Workout = require('../model/Workout_Model');
const db = require('../config/db');

class Workout_Service {
    static async createWorkout(workoutData) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Create workout
            const workoutResult = await Workout.create(workoutData);
            const workoutId = workoutResult.insertId;
            
            // Add exercises if provided
            if (workoutData.exercises && workoutData.exercises.length > 0) {
                for (const exercise of workoutData.exercises) {
                    // Insert workout exercise
                    const [exerciseResult] = await connection.execute(
                        `INSERT INTO workout_exercises 
                        (workout_id, exercise_id, position, target_sets, target_reps, target_weight, target_time) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            workoutId,
                            exercise.exercise_id,
                            exercise.position,
                            exercise.target_sets,
                            exercise.target_reps,
                            exercise.target_weight,
                            exercise.target_time
                        ]
                    );
                    
                    const workoutExerciseId = exerciseResult.insertId;
                    
                    // Add sets if provided
                    if (exercise.sets && exercise.sets.length > 0) {
                        for (const set of exercise.sets) {
                            await connection.execute(
                                `INSERT INTO workout_sets 
                                (workout_exercise_id, set_index, target_reps, target_weight, target_time, rest_seconds) 
                                VALUES (?, ?, ?, ?, ?, ?)`,
                                [
                                    workoutExerciseId,
                                    set.set_index,
                                    set.target_reps,
                                    set.target_weight,
                                    set.target_time,
                                    set.rest_seconds
                                ]
                            );
                        }
                    }
                }
            }
            
            await connection.commit();
            return {
                success: true,
                data: { id: workoutId, ...workoutData }
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getWorkoutById(id) {
        try {
            const workout = await Workout.getWithExercises(id);
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
            const workouts = await Workout.findByProgramId(programId);
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
            const workouts = await Workout.findUpcoming(userId, days);
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
            const existing = await Workout.findById(id);
            if (!existing) {
                throw new Error('Workout not found');
            }

            await Workout.update(id, workoutData);
            return {
                success: true,
                message: 'Workout updated successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    static async deleteWorkout(id) {
        try {
            const existing = await Workout.findById(id);
            if (!existing) {
                throw new Error('Workout not found');
            }

            await Workout.delete(id);
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
            const original = await Workout.getWithExercises(workoutId);
            if (!original) {
                throw new Error('Original workout not found');
            }

            // Create new workout with provided data or copy from original
            const workoutData = {
                program_id: newData.program_id || original.program_id,
                sport_id: newData.sport_id || original.sport_id,
                name: newData.name || `${original.name} (Copy)`,
                scheduled_on: newData.scheduled_on || original.scheduled_on,
                position: newData.position || original.position,
                exercises: original.exercises
            };

            return await this.createWorkout(workoutData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Workout_Service;