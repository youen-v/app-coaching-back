// services/Workout/Exercise.js
const db = require('../../config/db'); // mysql2/promise pool

class ExerciseService {
  // Récupère tous les exercices
  static async getAllExercises() {
    const [rows] = await db.execute(
      `SELECT id,
              sport_id   AS sportId,
              name,
              description,
              default_unit AS defaultUnit,
              created_at AS createdAt
       FROM exercises`,
      []
    );
    return { success: true, data: rows, count: rows.length };
  }

  // Crée un nouvel exercice
  static async createExercise(data) {
    if (!data.name || !data.sportId) {
      throw new Error('name et sportId sont requis');
    }
    const [result] = await db.execute(
      `INSERT INTO exercises (sport_id, name, description, default_unit, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [data.sportId, data.name, data.description || null, data.defaultUnit || null]
    );
    return {
      success: true,
      data: {
        id: result.insertId,
        sportId: data.sportId,
        name: data.name,
        description: data.description || null,
        defaultUnit: data.defaultUnit || null,
        createdAt: new Date().toISOString()
      }
    };
  }

  // Récupère un exercice par ID
  static async getExerciseById(id) {
    const [rows] = await db.execute(
      `SELECT id,
              sport_id   AS sportId,
              name,
              description,
              default_unit AS defaultUnit,
              created_at AS createdAt
       FROM exercises WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) throw new Error('Exercise not found');
    return { success: true, data: rows[0] };
  }

  // Met à jour un exercice
  static async updateExercise(id, data) {
    // Vérifie existence
    const [exists] = await db.execute(`SELECT id FROM exercises WHERE id = ?`, [id]);
    if (exists.length === 0) throw new Error('Exercise not found');

    const fields = [];
    const params = [];
    if (data.sportId)    { fields.push('sport_id = ?');    params.push(data.sportId); }
    if (data.name)       { fields.push('name = ?');        params.push(data.name); }
    if (data.description !== undefined) {
      fields.push('description = ?'); params.push(data.description);
    }
    if (data.defaultUnit !== undefined) {
      fields.push('default_unit = ?'); params.push(data.defaultUnit);
    }
    if (fields.length === 0) throw new Error('Aucun champ à mettre à jour');

    params.push(id);
    const sql = `UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(sql, params);
    return { success: true, message: 'Exercise updated successfully' };
  }

  // Supprime un exercice
  static async deleteExercise(id) {
    const [exists] = await db.execute(`SELECT id FROM exercises WHERE id = ?`, [id]);
    if (exists.length === 0) throw new Error('Exercise not found');
    await db.execute(`DELETE FROM exercises WHERE id = ?`, [id]);
    return { success: true, message: 'Exercise deleted successfully' };
  }

  // Récupère les exercices d’un sport
  static async getExercisesBySport(sportId) {
    const [rows] = await db.execute(
      `SELECT id,
              sport_id   AS sportId,
              name,
              description,
              default_unit AS defaultUnit,
              created_at AS createdAt
       FROM exercises WHERE sport_id = ?`,
      [sportId]
    );
    return { success: true, data: rows, count: rows.length };
  }
}

module.exports = ExerciseService;
