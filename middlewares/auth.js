// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const token = authHeader.slice(7);
    console.log('Token extracted:', token); // Debug
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug
    
    // Définir à la fois req.userId et req.user pour compatibilité
    req.userId = decoded.sub || decoded.id || decoded.userId;
    req.user = { id: req.userId, ...decoded };
    
    console.log('req.userId set to:', req.userId); // Debug
    console.log('req.user set to:', req.user); // Debug
    
    next();
  } catch (error) {
    console.error('Auth error:', error); // Debug
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Reste du code inchangé...
const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      let query;
      const resourceId = req.params.id;
      const userId = req.userId;

      switch (resourceType) {
        case 'program':
          query = 'SELECT user_id FROM programs WHERE id = ?';
          break;
        case 'workout':
          query = 'SELECT p.user_id FROM workouts w JOIN programs p ON w.program_id = p.id WHERE w.id = ?';
          break;
        case 'workoutLog':
          query = 'SELECT user_id FROM workout_logs WHERE id = ?';
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid resource type' });
      }

      const [rows] = await db.execute(query, [resourceId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: `${resourceType} not found` });
      }
      if (rows[0].user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authorization error' });
    }
  };
};

const isAdmin = async (req, res, next) => {
  try {
    const [users] = await db.execute('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization error' });
  }
};

const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  return (req, res, next) => {
    const key = req.userId || req.ip;
    const now = Date.now();
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    const recent = requests.get(key).filter(ts => now - ts < windowMs);
    if (recent.length >= maxRequests) {
      return res.status(429).json({ success: false, message: 'Too many requests, please try again later' });
    }
    recent.push(now);
    requests.set(key, recent);
    next();
  };
};

module.exports = {
  authenticate,
  checkOwnership,
  isAdmin,
  rateLimiter
};