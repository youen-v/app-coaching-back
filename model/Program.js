// models/programModel.js
const db = require('../config/db');

class Program {
    static async create(programData) {
        const { user_id, name, goal } = programData;
        const query = `
            INSERT INTO programs (user_id, name, goal, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        const [result] = await db.execute(query, [user_id, name, goal]);
        return result;
    }

    static async find_By_Id(id) {
        const query = `
            SELECT p.*, u.username 
            FROM programs p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const query = `
            SELECT p.*, 
                COUNT(DISTINCT w.id) as workout_count,
                MIN(w.scheduled_on) as start_date,
                MAX(w.scheduled_on) as end_date
            FROM programs p
            LEFT JOIN workouts w ON p.id = w.program_id
            WHERE p.user_id = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async update(id, programData) {
        const { name, goal } = programData;
        const query = `
            UPDATE programs 
            SET name = ?, goal = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [name, goal, id]);
        return result;
    }

    static async delete(id) {
        const query = 'DELETE FROM programs WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    static async getActivePrograms(userId) {
        const query = `
            SELECT p.*, 
                COUNT(DISTINCT w.id) as total_workouts,
                COUNT(DISTINCT wl.id) as completed_workouts,
                MAX(wl.performed_at) as last_workout_date
            FROM programs p
            LEFT JOIN workouts w ON p.id = w.program_id
            LEFT JOIN workout_logs wl ON w.id = wl.workout_id
            WHERE p.user_id = ? 
            AND (w.scheduled_on >= CURDATE() OR w.scheduled_on IS NULL)
            GROUP BY p.id
            HAVING total_workouts > completed_workouts OR completed_workouts = 0
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }
}

module.exports = Program;