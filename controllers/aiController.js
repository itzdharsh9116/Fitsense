const GeminiService = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/response');

class AIController {
  /**
   * Generate personalized workout recommendations
   * POST /api/ai/recommendation
   */
  static async getRecommendation(req, res, next) {
    try {
      const { age, fitnessGoal, experienceLevel } = req.body;

      if (!age || !fitnessGoal || !experienceLevel) {
        return errorResponse(res, 400, 'Please provide age, fitnessGoal, and experienceLevel');
      }

      if (typeof age !== 'number' || age <= 0 || age > 120) {
        return errorResponse(res, 400, 'Please provide a valid age between 1 and 120');
      }

      const recommendation = await GeminiService.generateWorkoutRecommendation({
        age,
        fitnessGoal: String(fitnessGoal).trim(),
        experienceLevel: String(experienceLevel).trim()
      });

      return successResponse(res, 200, 'AI workout recommendation generated successfully', recommendation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate fitness insights from stats
   * POST /api/ai/insights
   */
  static async getInsights(req, res, next) {
    try {
      const { totalWorkouts, averageWorkoutDuration, caloriesBurned } = req.body;

      if (totalWorkouts === undefined || averageWorkoutDuration === undefined || caloriesBurned === undefined) {
        return errorResponse(res, 400, 'Please provide totalWorkouts, averageWorkoutDuration, and caloriesBurned');
      }

      if (Number(totalWorkouts) < 0 || Number(averageWorkoutDuration) < 0 || Number(caloriesBurned) < 0) {
        return errorResponse(res, 400, 'Statistics parameters must be non-negative numbers');
      }

      const insights = await GeminiService.generateFitnessInsights({
        totalWorkouts: Number(totalWorkouts),
        averageWorkoutDuration: Number(averageWorkoutDuration),
        caloriesBurned: Number(caloriesBurned)
      });

      return successResponse(res, 200, 'AI fitness insights generated successfully', insights);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController;
