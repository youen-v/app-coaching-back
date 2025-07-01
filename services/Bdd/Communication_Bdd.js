// Les imports
import knex from 'knex';
import dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

//#region Clé de connexion à la bdd

// Variable d'environnement pour se connecter
export const DATA_BASE = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost', // adresse ip
    user: process.env.DB_USER || 'root', //username
    password: process.env.DB_PASS || '', // pas de password
    database: process.env.DB_NAME || 'projet_annuel', // nom bdd
    charset: 'utf8mb4'
  },
  pool: { min: 0, max: 10 }
});

// méthode pour Fermer la connection avec la bdd
export const close_Db = async () => DATA_BASE.destroy();
//#endregion
//#region Méthode CRUD
const Table = (name) => DATA_BASE(name);
const CRUD = (name) => ({
  // Insert dans table
  create: (data) => Table(name).insert(data),
  //  Select une donnée avec une id
  findById: (id) => Table(name).where({ id }).first(),
  // Mettre à jour les colonnes d'une lgine
  update: (id, data) => Table(name).where({ id }).update(data),
  // Supprimer un enregistrement dans la table
  remove: (id) => Table(name).where({ id }).delete()
});
//#endregion
//#region table USERS
// Injection des méthodes CRUD pour USERS
export const USERS = {
  ...CRUD('users'),
  find_By_Email: (email) => Table('users').where({ email }).first()
};
//#endregion
//#region table SPORTS
export const SPORTS = CRUD('sports');
//#endregion
//#region Table USERSPORTS
// Table de liason USER et SPORT
export const USERSPORTS = {
  // Associe un sport à un utilisateur
  addSport: ({ user_id, sport_id, started_at = new Date() }) =>
    // nouvelle enregistrement dans user_sports
    Table('user_sports').insert({ user_id, sport_id, started_at }),
    // Retire l'association entre un sport et un utilisateur
    removeSport: ({ user_id, sport_id }) =>
    Table('user_sports').where({ user_id, sport_id }).delete(),
    // Récupère tous les sports pratiqués par un utilisateur
    listSportsByUser: (user_id) =>
    Table('sports')
      .join('user_sports', 'sports.id', 'user_sports.sport_id')
      .where('user_sports.user_id', user_id)
      .select('sports.*', 'user_sports.started_at'),
    // Récupère tout les utilisateurs qui pratiquent un sport donné
    listUsersBySport: (sport_id) =>
      Table('users')
        .join('user_sports', 'users.id', 'user_sports.user_id')
        .where('user_sports.sport_id', sport_id)
        .select('users.*', 'user_sports.started_at')
};
//#endregion
//#region Table EXERCISES
export const EXERCISES = CRUD('exercises');
//#endregion
//#region Table Programme
export const PROGRAMS = {
  ...CRUD('programs'),
  listByUser: (user_id) => Table('programs').where({ user_id })
};
//#endregion
//#region Table WORKOUTS
export const WORKOUTS = {
  ...CRUD('workouts'),
  listByProgram: (program_id) => Table('workouts').where({ program_id }),
  listBySport: (sport_id) => Table('workouts').where({ sport_id })
};
//#endregion
//#region WORKOUTS_EXERCICES
export const WORKOUTS_EXERCICES = {
  ...CRUD('workout_exercises'),
  listByWorkout: (workout_id) =>
    Table('workout_exercises')
      .where({ workout_id })
      .orderBy('position', 'asc')
};
//#endregion
//#region WOURKOUTS_SETS
export const WOURKOUTS_SETS = {
  ...CRUD('workout_sets'),
  // Récupère toutes les séries d'un exercice spécifique dans un workout
  listByWorkoutExercise: (workout_exercise_id) =>
    Table('workout_sets').where({ workout_exercise_id }).orderBy('set_index', 'asc')
};
//#endregion
//#region WORKOUT_LOGS
export const WORKOUT_LOGS = {
  ...CRUD('workout_logs'),
//Récupère l'historique des workouts d'un utilisateur, triés du plus récent au plus ancien
  listByUser: (user_id) => Table('workout_logs').where({ user_id }).orderBy('performed_at', 'desc')
};
//#endregion
//#region LOG_EXERCICES

export const LOG_EXERCICES = {
  ...CRUD('log_exercises'),
 // Récupère tous les exercices d'une séance spécifique
  listByLog: (workout_log_id) => Table('log_exercises').where({ workout_log_id })
};
//#endregion
//#region LOG_SETS
export const LOG_SETS = {
  ...CRUD('log_sets'),
  // Récupère toutes les séries d'un exercice, triées par ordre d'exécution
  listByLogExercise: (log_exercise_id) => Table('log_sets').where({ log_exercise_id }).orderBy('set_index')
};
//#endregion
// Enregistre une séance complète en une seule transaction
/**
 * Enregistre une séance d'entraînement complète en une transaction atomique
 * @param {number} userId - ID de l'utilisateur
 * @param {Object} workoutData - Données de la séance
 * @param {number|null} workoutData.workout_id - ID du template (null si séance libre)
 * @param {Date} workoutData.performed_at - Date/heure de réalisation
 * @param {string} workoutData.comment - Commentaire sur la séance
 * @param {Array} workoutData.exercises - Liste des exercices effectués
 * @returns {Promise<number>} ID du log créé
 */
export const record_Full_Workout = async (userId, { workout_id = null, performed_at, comment, exercises }) => {
  return DATA_BASE.transaction(async (trx) => {
    const [logId] = await trx('workout_logs').insert({ user_id: userId, workout_id, performed_at, comment });
    // Pour chaque exercice de la séance
    for (const ex of exercises) {
      // Enregistre l'exercice dans le log avec sa position
      const [logExId] = await trx('log_exercises').insert({ workout_log_id: logId, exercise_id: ex.exercise_id, position: ex.position });
      for (const s of ex.sets) {
        //Enregistre les performances réelles de chaque série
        await trx('log_sets').insert({
          log_exercise_id: logExId,
          set_index: s.set_index,
          reps: s.reps,
          weight: s.weight,
          duration_sec: s.duration_sec,
          rest_sec: s.rest_sec
        });
      }
    }
    return logId;
  });
};
//#region DAILY_STEPS

export const DAILY_STEPS = {
 // Récupère les pas sur une période
  upsert: async ({ user_id, step_date, steps }) =>
    DATA_BASE.raw(`INSERT INTO daily_steps (user_id, step_date, steps) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE steps = VALUES(steps)` , [user_id, step_date, steps]),
  listByUser: (user_id, from, to) =>
    Table('daily_steps').where({ user_id }).andWhereBetween('step_date', [from, to]).orderBy('step_date')
};
//#endregion
//#region RUNS
export const RUNS = {
  ...CRUD('runs'),
    // Historique des courses triées par date
  listByUser: (user_id) => Table('runs').where({ user_id }).orderBy('run_date', 'desc')
};
//#endregion
//#region Daily_MACROS
// But : Suivi quotidien des macronutriments
// Données : Calories, protéines, glucides, lipides
export const DAILY_MACROS = {
  upsert: async ({ user_id, macro_date, calories, protein_g, carbs_g, fat_g }) =>
    DATA_BASE.raw(`INSERT INTO daily_macros (user_id, macro_date, calories, protein_g, carbs_g, fat_g)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE calories = VALUES(calories), protein_g = VALUES(protein_g), carbs_g = VALUES(carbs_g), fat_g = VALUES(fat_g)` ,
      [user_id, macro_date, calories, protein_g, carbs_g, fat_g]),
  listByUser: (user_id, from, to) =>
    Table('daily_macros').where({ user_id }).andWhereBetween('macro_date', [from, to]).orderBy('macro_date')
};
//#endregion
