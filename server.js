const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root / Health Check API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitSense AI / FitTrack AI Backend API is running',
    version: '1.0.0',
    documentation: 'See README.md for endpoint details'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Initialize database and start server listening
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`FitSense AI Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
  return server;
};

// Start server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
