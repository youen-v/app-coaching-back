// models/workoutModel.js
const db = require('../config/db');

class Workout {
    static async create(workoutData) {
        const { program_id, sport_id, name, scheduled_on, position } = workoutData;
        const query = `
            INSERT INTO workouts (program_id, sport_id, name, scheduled_on, position)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [program_id, sport_id, name, scheduled_on, position]);
        return result;
    }

    static async find_By_Id(id) {
        const query = `
            SELECT w.*, p.name as program_name, s.name as sport_name
            FROM workouts w
            LEFT JOIN programs p ON w.program_id = p.id
            LEFT JOIN sports s ON w.sport_id = s.id
            WHERE w.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async find_By_ProgramId(programId) {
        const query = `
            SELECT w.*, s.name as sport_name
            FROM workouts w
            LEFT JOIN sports s ON w.sport_id = s.id
            WHERE w.program_id = ?
            ORDER BY w.position, w.scheduled_on
        `;
        const [rows] = await db.execute(query, [programId]);
        return rows;
    }

    static async find_Up_Coming(userId, days = 7) {
        const query = `
            SELECT w.*, p.name as program_name, s.name as sport_name
            FROM workouts w
            JOIN programs p ON w.program_id = p.id
            LEFT JOIN sports s ON w.sport_id = s.id
            WHERE p.user_id = ? 
            AND w.scheduled_on BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY w.scheduled_on, w.position
        `;
        const [rows] = await db.execute(query, [userId, days]);
        return rows;
    }

    static async update(id, workoutData) {
        const { program_id, sport_id, name, scheduled_on, position } = workoutData;
        const query = `
            UPDATE workouts 
            SET program_id = ?, sport_id = ?, name = ?, scheduled_on = ?, position = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [program_id, sport_id, name, scheduled_on, position, id]);
        return result;
    }

    static async delete(id) {
        const query = 'DELETE FROM workouts WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    static async get_With_Exercises(workoutId) {
        const workout = await this.find_By_Id(workoutId);
        if (!workout) return null;

        const exercisesQuery = `
            SELECT we.*, e.name as exercise_name, e.description, e.default_unit
            FROM workout_exercises we
            JOIN exercises e ON we.exercise_id = e.id
            WHERE we.workout_id = ?
            ORDER BY we.position
        `;
        const [exercises] = await db.execute(exercisesQuery, [workoutId]);

        // Get sets for each exercise
        for (let exercise of exercises) {
            const setsQuery = `
                SELECT * FROM workout_sets 
                WHERE workout_exercise_id = ? 
                ORDER BY set_index
            `;
            const [sets] = await db.execute(setsQuery, [exercise.id]);
            exercise.sets = sets;
        }

        workout.exercises = exercises;
        return workout;
    }
}

module.exports = Workout;