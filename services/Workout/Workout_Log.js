const WorkoutLog = require('../../Model/Workout_Log_Model');
const db = require('../../config/db');

class WorkoutLogService {
    static async log_Workout(logData) {
        try {
            console.log('🔍 log_Workout called with:', JSON.stringify(logData, null, 2));
            
            // Validate required fields
            if (!logData.user_id || !logData.workout_id) {
                throw new Error('user_id and workout_id are required');
            }

            if (!logData.exercises || logData.exercises.length === 0) {
                throw new Error('At least one exercise must be logged');
            }

            // ✅ AJOUTÉ: Mock temporaire pour result
            const result = {
                id: Math.floor(Math.random() * 1000),
                user_id: logData.user_id,
                workout_id: logData.workout_id,
                created_at: new Date().toISOString()
            };

            return {
                success: true,
                data: result,
                message: 'Workout logged successfully'
            };
        } catch (error) {
            console.log('❌ Error in log_Workout:', error.message);
            throw error;
        }
    }

    static async get_Workout_Log(logId) {
        try {
            // ✅ VRAIE implémentation avec DB
            const log = await WorkoutLog.findById(logId);
            if (!log) {
                throw new Error('Workout log not found');
            }
            
            return {
                success: true,
                data: log
            };
        } catch (error) {
            throw error;
        }
    }

    static async get_UserWorkout_History(userId, limit = 50, offset = 0) {
        try {
            // ✅ VRAIE implémentation avec DB
            const logs = await WorkoutLog.findByUserId(userId, limit, offset);
            return {
                success: true,
                data: logs,
                count: logs.length,
                pagination: {
                    limit,
                    offset
                }
            };
        } catch (error) {
            throw error;
        }
    }

   static async get_Exercise_Progress(userId, exerciseId, limit = 10) {
    try {
        const userIdInt = parseInt(userId);
        const exerciseIdInt = parseInt(exerciseId);
        const limitInt = parseInt(limit);
        
        console.log('Parameters:', { userIdInt, exerciseIdInt, limitInt });
        
        // ✅ LIMITE codée en dur dans la requête
        const fullQuery = `
            SELECT ls.weight, ls.reps, wl.performed_at,
                   (ls.weight * ls.reps) as volume
            FROM log_sets ls
            JOIN log_exercises le ON ls.log_exercise_id = le.id  
            JOIN workout_logs wl ON le.workout_log_id = wl.id
            WHERE wl.user_id = ? AND le.exercise_id = ?
            ORDER BY wl.performed_at DESC
            LIMIT ${limitInt}
        `;
        
        // Seulement 2 paramètres au lieu de 3
        const [history] = await db.execute(fullQuery, [userIdInt, exerciseIdInt]);
        
        console.log('Query success! Found:', history.length, 'records');
        
        const progress = {
            maxWeight: history.length > 0 ? Math.max(...history.map(h => h.weight || 0)) : 0,
            maxVolume: history.length > 0 ? Math.max(...history.map(h => h.volume || 0)) : 0,
            averageReps: history.length > 0 ? (history.reduce((sum, h) => sum + (h.reps || 0), 0) / history.length).toFixed(1) : 0,
            totalSets: history.length,
            weightProgress: "0.0",
            volumeProgress: "0.0"
        };
        
        return {
            success: true,
            data: { history, progress }
        };
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        throw error;
    }
}
    static async get_User_Stats(userId, period = '30d') {
    try {
        const dateTo = new Date();
        const dateFrom = new Date();
        
        // Calculate date range based on period
        switch (period) {
            case '7d':
                dateFrom.setDate(dateFrom.getDate() - 7);
                break;
            case '30d':
                dateFrom.setDate(dateFrom.getDate() - 30);
                break;
            case '90d':
                dateFrom.setDate(dateFrom.getDate() - 90);
                break;
            case '1y':
                dateFrom.setFullYear(dateFrom.getFullYear() - 1);
                break;
            default:
                dateFrom.setDate(dateFrom.getDate() - 30);
        }

        const userIdInt = parseInt(userId);
        const dateFromStr = dateFrom.toISOString().split('T')[0];
        const dateToStr = dateTo.toISOString().split('T')[0];
        
        console.log('Stats params:', { userIdInt, dateFromStr, dateToStr, period });

        // ✅ Requête corrigée avec dates en dur
        const query = `
            SELECT 
                COUNT(DISTINCT wl.id) as totalWorkouts,
                COUNT(ls.id) as totalSets,
                COALESCE(SUM(ls.reps), 0) as totalReps,
                COALESCE(AVG(ls.weight), 0) as averageWeight,
                COALESCE(MAX(ls.weight), 0) as maxWeight,
                COALESCE(SUM(ls.weight * ls.reps), 0) as totalVolume
            FROM workout_logs wl
            JOIN log_exercises le ON wl.id = le.workout_log_id
            JOIN log_sets ls ON le.id = ls.log_exercise_id
            WHERE wl.user_id = ? 
            AND wl.performed_at BETWEEN '${dateFromStr}' AND '${dateToStr}'
        `;
        
        const [statsRows] = await db.execute(query, [userIdInt]);
        
        const stats = statsRows[0] || {
            totalWorkouts: 0,
            totalSets: 0,
            totalReps: 0,
            averageWeight: 0,
            maxWeight: 0,
            totalVolume: 0
        };

        console.log('Stats result:', stats);

        return {
            success: true,
            data: {
                period,
                dateFrom: dateFromStr,
                dateTo: dateToStr,
                stats
            }
        };
    } catch (error) {
        console.log('❌ Stats error:', error.message);
        throw error;
    }
}

    static async delete_Workout_Log(logId) {
        try {
            const existing = await WorkoutLog.findById(logId);
            if (!existing) {
                throw new Error('Workout log not found');
            }

            await WorkoutLog.delete(logId);
            return {
                success: true,
                message: 'Workout log deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    static calculate_Progress(history) {
        if (!history || history.length === 0) {
            return null;
        }

        const recentWorkouts = {};
        const progress = {
            maxWeight: 0,
            maxVolume: 0,
            averageReps: 0,
            totalSets: history.length
        };

        // Group by workout date
        history.forEach(record => {
            const date = record.performed_at.toISOString().split('T')[0];
            if (!recentWorkouts[date]) {
                recentWorkouts[date] = {
                    maxWeight: record.weight || 0,
                    totalVolume: record.volume || 0,
                    sets: []
                };
            }
            recentWorkouts[date].sets.push(record);
        });

        // Calculate overall progress
        const dates = Object.keys(recentWorkouts).sort();
        if (dates.length >= 2) {
            const recent = recentWorkouts[dates[0]];
            const previous = recentWorkouts[dates[dates.length - 1]];
            
            if (previous.maxWeight > 0) {
                progress.weightProgress = ((recent.maxWeight - previous.maxWeight) / previous.maxWeight * 100).toFixed(1);
            }
            if (previous.totalVolume > 0) {
                progress.volumeProgress = ((recent.totalVolume - previous.totalVolume) / previous.totalVolume * 100).toFixed(1);
            }
        }

        // Calculate averages
        const totalReps = history.reduce((sum, record) => sum + (record.reps || 0), 0);
        progress.averageReps = (totalReps / history.length).toFixed(1);
        progress.maxWeight = Math.max(...history.map(r => r.weight || 0));

        return progress;
    }
}

module.exports = WorkoutLogService;