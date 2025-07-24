const express = require('express');
const cors = require('cors');

const authRoutes        = require('./routes/authRoutes');
const exerciseRoutes    = require('./routes/Exercise_Routes');
const programRoutes     = require('./routes/Program_Routes');
const workoutRoutes     = require('./routes/Workout_Routes');
const workoutLogRoutes  = require('./routes/Workout_Log_Routes');
const errorHandler      = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',             authRoutes);        
app.use('/api',             exerciseRoutes);
app.use('/api',             programRoutes);        
app.use('/api',             workoutRoutes);       
app.use('/api',             workoutLogRoutes);     

app.use(errorHandler);

module.exports = app;