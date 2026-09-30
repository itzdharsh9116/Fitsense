const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

// All workout routes require authentication
router.use(authMiddleware);

// Workout CRUD & Search endpoints
router.post('/', WorkoutController.createWorkout);
router.get('/', WorkoutController.getWorkouts);

// Search endpoint (placed before /:id parameter route)
router.get('/search', WorkoutController.searchWorkouts);

router.get('/:id', WorkoutController.getWorkoutById);
router.put('/:id', WorkoutController.updateWorkout);
router.delete('/:id', WorkoutController.deleteWorkout);

module.exports = router;
