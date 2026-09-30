const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const { successResponse, errorResponse } = require('../utils/response');

class WorkoutController {
  /**
   * Create a new workout
   * POST /api/workouts
   */
  static async createWorkout(req, res, next) {
    try {
      const { workoutName, category, duration, caloriesBurned, workoutDate } = req.body;

      if (!workoutName || !category || duration === undefined || caloriesBurned === undefined) {
        return errorResponse(res, 400, 'Please provide workoutName, category, duration, and caloriesBurned');
      }

      if (Number(duration) <= 0) {
        return errorResponse(res, 400, 'Duration must be greater than zero');
      }

      if (Number(caloriesBurned) < 0) {
        return errorResponse(res, 400, 'Calories burned must be greater than or equal to zero');
      }

      const workout = await Workout.create({
        user: req.user.id, // Enforce authenticated user as owner
        workoutName: workoutName.trim(),
        category: category.trim(),
        duration: Number(duration),
        caloriesBurned: Number(caloriesBurned),
        workoutDate: workoutDate ? new Date(workoutDate) : new Date()
      });

      return successResponse(res, 201, 'Workout created successfully', workout);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all workouts for authenticated user
   * GET /api/workouts
   */
  static async getWorkouts(req, res, next) {
    try {
      const workouts = await Workout.find({ user: req.user.id }).sort({ workoutDate: -1 });
      return successResponse(res, 200, 'Workouts retrieved successfully', workouts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get workout by ID for authenticated user
   * GET /api/workouts/:id
   */
  static async getWorkoutById(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 400, `Invalid Workout ID format: ${id}`);
      }

      const workout = await Workout.findById(id);

      if (!workout) {
        return errorResponse(res, 404, 'Workout not found');
      }

      // Security check: ensure workout belongs to authenticated user
      if (workout.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Access denied. You do not have permission to view this workout.');
      }

      return successResponse(res, 200, 'Workout retrieved successfully', workout);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a workout by ID
   * PUT /api/workouts/:id
   */
  static async updateWorkout(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 400, `Invalid Workout ID format: ${id}`);
      }

      const workout = await Workout.findById(id);

      if (!workout) {
        return errorResponse(res, 404, 'Workout not found');
      }

      // Security check: user isolation
      if (workout.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Access denied. You can only update your own workouts.');
      }

      const { workoutName, category, duration, caloriesBurned, workoutDate } = req.body;

      if (duration !== undefined && Number(duration) <= 0) {
        return errorResponse(res, 400, 'Duration must be greater than zero');
      }

      if (caloriesBurned !== undefined && Number(caloriesBurned) < 0) {
        return errorResponse(res, 400, 'Calories burned must be greater than or equal to zero');
      }

      if (workoutName !== undefined) workout.workoutName = workoutName.trim();
      if (category !== undefined) workout.category = category.trim();
      if (duration !== undefined) workout.duration = Number(duration);
      if (caloriesBurned !== undefined) workout.caloriesBurned = Number(caloriesBurned);
      if (workoutDate !== undefined) workout.workoutDate = new Date(workoutDate);

      const updatedWorkout = await workout.save();

      return successResponse(res, 200, 'Workout updated successfully', updatedWorkout);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a workout by ID
   * DELETE /api/workouts/:id
   */
  static async deleteWorkout(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 400, `Invalid Workout ID format: ${id}`);
      }

      const workout = await Workout.findById(id);

      if (!workout) {
        return errorResponse(res, 404, 'Workout not found');
      }

      // Security check: user isolation
      if (workout.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Access denied. You can only delete your own workouts.');
      }

      await Workout.findByIdAndDelete(id);

      return successResponse(res, 200, 'Workout deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search workouts with combined filters (name, category, date)
   * GET /api/workouts/search?name=running&category=cardio&date=2026-09-26
   */
  static async searchWorkouts(req, res, next) {
    try {
      const { name, category, date } = req.query;

      // Always filter by authenticated user
      const query = { user: req.user.id };

      if (name) {
        query.workoutName = { $regex: name, $options: 'i' };
      }

      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }

      if (date) {
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999);

        query.workoutDate = { $gte: startDate, $lte: endDate };
      }

      const workouts = await Workout.find(query).sort({ workoutDate: -1 });

      return successResponse(res, 200, 'Search results retrieved successfully', workouts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WorkoutController;
