// models/exerciseModel.js
const db = require('../config/db');

class Exercise {
    static async create(exerciseData) {
        const { sport_id, name, description, default_unit } = exerciseData;
        const query = `
            INSERT INTO exercises (sport_id, name, description, default_unit, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await db.execute(query, [sport_id, name, description, default_unit]);
        return result;
    }

    static async find_By_Id(id) {
        const query = `
            SELECT e.*, s.name as sport_name 
            FROM exercises e
            LEFT JOIN sports s ON e.sport_id = s.id
            WHERE e.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async find_All(filters = {}) {
        let query = `
            SELECT e.*, s.name as sport_name 
            FROM exercises e
            LEFT JOIN sports s ON e.sport_id = s.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.sport_id) {
            query += ' AND e.sport_id = ?';
            params.push(filters.sport_id);
        }

        if (filters.search) {
            query += ' AND (e.name LIKE ? OR e.description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        query += ' ORDER BY e.name';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async update(id, exerciseData) {
        const { sport_id, name, description, default_unit } = exerciseData;
        const query = `
            UPDATE exercises 
            SET sport_id = ?, name = ?, description = ?, default_unit = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [sport_id, name, description, default_unit, id]);
        return result;
    }

    static async delete(id) {
        const query = 'DELETE FROM exercises WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    static async find_By_Sport_Id(sportId) {
        const query = `
            SELECT * FROM exercises 
            WHERE sport_id = ? 
            ORDER BY name
        `;
        const [rows] = await db.execute(query, [sportId]);
        return rows;
    }
}

module.exports = Exercise;