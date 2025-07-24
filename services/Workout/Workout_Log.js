
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

        // Mock temporaire - retourne un succès fictif
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
            const log = await WorkoutLog.getFullLog(logId);
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
        // Mock temporaire pour tester
        const logs = [];
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
        // Mock history
        const history = [];
        
        // Mock progress
        const progress = {
            maxWeight: 0,
            maxVolume: 0,
            averageReps: 0,
            totalSets: 0,
            weightProgress: "0.0",
            volumeProgress: "0.0"
        };
        
        return {
            success: true,
            data: {
                history,
                progress
            }
        };
    } catch (error) {
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

        // Mock stats
        const stats = {
            totalWorkouts: 0,
            totalSets: 0,
            totalReps: 0,
            averageWeight: 0,
            maxWeight: 0,
            totalVolume: 0
        };

        return {
            success: true,
            data: {
                period,
                dateFrom: dateFrom.toISOString().split('T')[0],
                dateTo: dateTo.toISOString().split('T')[0],
                stats
            }
        };
    } catch (error) {
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
                    maxWeight: record.max_weight,
                    totalVolume: record.total_volume,
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
            
            progress.weightProgress = ((recent.maxWeight - previous.maxWeight) / previous.maxWeight * 100).toFixed(1);
            progress.volumeProgress = ((recent.totalVolume - previous.totalVolume) / previous.totalVolume * 100).toFixed(1);
        }

        // Calculate averages
        const totalReps = history.reduce((sum, record) => sum + (record.reps || 0), 0);
        progress.averageReps = (totalReps / history.length).toFixed(1);
        progress.maxWeight = Math.max(...history.map(r => r.weight || 0));

        return progress;
    }
}

module.exports = WorkoutLogService;