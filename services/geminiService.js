const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service for Google Gemini AI integrations
 */
class GeminiService {
  /**
   * Helper to strip markdown code blocks and parse JSON
   * @param {string} text 
   * @returns {Object}
   */
  static _parseJsonResponse(text) {
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Failed to parse raw Gemini JSON response, returning structured fallback string:', text);
      return { rawResponse: text };
    }
  }

  /**
   * Generate personalized workout recommendations
   * @param {Object} params - { age, fitnessGoal, experienceLevel }
   * @returns {Promise<Object>} Formatted AI Recommendation
   */
  static async generateWorkoutRecommendation({ age, fitnessGoal, experienceLevel }) {
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are a certified fitness trainer and AI fitness expert.
Generate a structured personalized workout plan for a user with the following profile:
- Age: ${age}
- Fitness Goal: ${fitnessGoal}
- Experience Level: ${experienceLevel}

You MUST return strictly valid JSON matching this exact format:
{
  "personalizedPlan": "A clear overview summary of the recommended workout plan tailored to the user's age, goal, and experience.",
  "weeklySuggestions": [
    { "day": "Day 1", "focus": "Target Muscle / Activity", "routine": "Detailed exercises and duration" },
    { "day": "Day 2", "focus": "Target Muscle / Activity", "routine": "Detailed exercises and duration" },
    { "day": "Day 3", "focus": "Rest & Recovery", "routine": "Light stretching or full rest" },
    { "day": "Day 4", "focus": "Target Muscle / Activity", "routine": "Detailed exercises and duration" },
    { "day": "Day 5", "focus": "Target Muscle / Activity", "routine": "Detailed exercises and duration" },
    { "day": "Day 6", "focus": "Active Recovery", "routine": "Yoga, walking, or mobility work" },
    { "day": "Day 7", "focus": "Rest", "routine": "Complete rest" }
  ],
  "suggestedExercises": [
    { "name": "Exercise Name", "sets": 3, "reps": "10-12", "notes": "Form tip" }
  ],
  "trainingTips": [
    "Tip 1 for success and consistency",
    "Tip 2 regarding hydration and nutrition"
  ],
  "safetyRecommendations": [
    "Proper warmup before workouts",
    "Listen to your body and stop if feeling sharp pain"
  ],
  "motivationalGuidance": "Encouraging closing words to inspire the user.",
  "disclaimer": "These recommendations provide general fitness guidance and are not a substitute for professional medical advice. Consult a healthcare professional before starting any new fitness program."
}`;

    if (!apiKey || apiKey === 'your_google_gemini_api_key' || apiKey === 'your_api_key_here') {
      // Fallback mock response for offline/demo mode when API key is not yet configured
      return {
        personalizedPlan: `Customized ${experienceLevel} level plan focused on ${fitnessGoal} for a ${age}-year-old individual.`,
        weeklySuggestions: [
          { day: "Day 1", focus: "Upper Body Strength", routine: "Pushups, Dumbbell Press, Bent-over Rows (30 mins)" },
          { day: "Day 2", focus: "Cardio & Core", routine: "Brisk walking or jogging + Plank circuits (35 mins)" },
          { day: "Day 3", focus: "Rest & Active Recovery", routine: "Light stretching and hydration" },
          { day: "Day 4", focus: "Lower Body Strength", routine: "Squats, Lunges, Calf Raises (30 mins)" },
          { day: "Day 5", focus: "Full Body HIIT", routine: "Jumping Jacks, Burpees, Mountain Climbers (25 mins)" },
          { day: "Day 6", focus: "Mobility & Yoga", routine: "Full body flexibility routine (20 mins)" },
          { day: "Day 7", focus: "Rest Day", routine: "Complete physical rest" }
        ],
        suggestedExercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "12-15", notes: "Keep chest up and knees aligned with toes" },
          { name: "Push-ups", sets: 3, reps: "8-12", notes: "Maintain a straight plank line from shoulders to ankles" },
          { name: "Plank Hold", sets: 3, reps: "30-45 secs", notes: "Engage core and do not let hips sag" }
        ],
        trainingTips: [
          "Maintain consistent sleep (7-8 hours) for optimal muscle recovery.",
          "Drink plenty of water before, during, and after your workouts."
        ],
        safetyRecommendations: [
          "Always perform a 5-minute dynamic warm-up before beginning strength training.",
          "Stop immediately if you experience dizziness, shortness of breath, or sharp joint pain."
        ],
        motivationalGuidance: `Stay focused on your ${fitnessGoal} goal! Consistency beats intensity every single time.`,
        disclaimer: "These recommendations provide general fitness guidance and are not a substitute for professional medical advice. Consult a healthcare professional before starting any new fitness program."
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const text = await GeminiService._generateContentWithFallback(genAI, prompt);
      const parsed = GeminiService._parseJsonResponse(text);

      // Ensure mandatory disclaimer field exists
      if (!parsed.disclaimer) {
        parsed.disclaimer = "These recommendations provide general fitness guidance and are not a substitute for professional medical advice.";
      }

      return parsed;
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      // Fallback mock response on unrecoverable API error to ensure system resilience
      return {
        personalizedPlan: `Customized ${experienceLevel} level plan focused on ${fitnessGoal} for a ${age}-year-old individual.`,
        weeklySuggestions: [
          { day: "Day 1", focus: "Upper Body Strength", routine: "Pushups, Dumbbell Press, Bent-over Rows (30 mins)" },
          { day: "Day 2", focus: "Cardio & Core", routine: "Brisk walking or jogging + Plank circuits (35 mins)" },
          { day: "Day 3", focus: "Rest & Active Recovery", routine: "Light stretching and hydration" },
          { day: "Day 4", focus: "Lower Body Strength", routine: "Squats, Lunges, Calf Raises (30 mins)" },
          { day: "Day 5", focus: "Full Body HIIT", routine: "Jumping Jacks, Burpees, Mountain Climbers (25 mins)" },
          { day: "Day 6", focus: "Mobility & Yoga", routine: "Full body flexibility routine (20 mins)" },
          { day: "Day 7", focus: "Rest Day", routine: "Complete physical rest" }
        ],
        suggestedExercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "12-15", notes: "Keep chest up and knees aligned with toes" },
          { name: "Push-ups", sets: 3, reps: "8-12", notes: "Maintain a straight plank line from shoulders to ankles" },
          { name: "Plank Hold", sets: 3, reps: "30-45 secs", notes: "Engage core and do not let hips sag" }
        ],
        trainingTips: [
          "Maintain consistent sleep (7-8 hours) for optimal muscle recovery.",
          "Drink plenty of water before, during, and after your workouts."
        ],
        safetyRecommendations: [
          "Always perform a 5-minute dynamic warm-up before beginning strength training.",
          "Stop immediately if you experience dizziness, shortness of breath, or sharp joint pain."
        ],
        motivationalGuidance: `Stay focused on your ${fitnessGoal} goal! Consistency beats intensity every single time.`,
        disclaimer: "These recommendations provide general fitness guidance and are not a substitute for professional medical advice. Consult a healthcare professional before starting any new fitness program."
      };
    }
  }

  /**
   * Helper method to attempt generating content with model fallback
   */
  static async _generateContentWithFallback(genAI, prompt) {
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash'
    ].filter(Boolean);

    let lastError = null;
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (err) {
        console.warn(`Gemini model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini model candidates failed');
  }

  /**
   * Generate fitness insights based on workout history stats
   * @param {Object} params - { totalWorkouts, averageWorkoutDuration, caloriesBurned }
   * @returns {Promise<Object>} Formatted AI Insights
   */
  static async generateFitnessInsights({ totalWorkouts, averageWorkoutDuration, caloriesBurned }) {
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are a sports data scientist and AI fitness coach.
Analyze the following user workout statistics and generate personalized insights:
- Total Workouts Completed: ${totalWorkouts}
- Average Workout Duration: ${averageWorkoutDuration} minutes
- Total Calories Burned: ${caloriesBurned} kcal

You MUST return strictly valid JSON matching this exact format:
{
  "performanceAnalysis": "Detailed assessment of the user's activity levels, total volume, and calorie expenditure efficiency.",
  "improvementSuggestions": [
    "Actionable recommendation 1 to increase endurance or intensity",
    "Actionable recommendation 2 regarding exercise balance or progressive overload"
  ],
  "motivationalAdvice": "Inspiring feedback celebrating their current progress.",
  "progressSummary": "A concise summary rating or overview of their overall fitness trajectory.",
  "disclaimer": "Fitness insights are generated by AI for informational tracking and motivation. Consult a certified coach or medical provider for tailored physical training."
}`;

    if (!apiKey || apiKey === 'your_google_gemini_api_key' || apiKey === 'your_api_key_here') {
      // Fallback mock response for offline/demo mode
      return {
        performanceAnalysis: `Great work completing ${totalWorkouts} workouts! With an average duration of ${averageWorkoutDuration} minutes and ${caloriesBurned} total calories burned, you are demonstrating strong consistency.`,
        improvementSuggestions: [
          "Try incorporating progressive overload by gradually increasing duration or weight every 2 weeks.",
          "Balance high-intensity sessions with adequate low-intensity recovery training."
        ],
        motivationalAdvice: `Burning ${caloriesBurned} calories takes dedication! Keep pushing towards your next milestone.`,
        progressSummary: `Overall Trajectory: Excellent momentum across ${totalWorkouts} recorded training sessions.`,
        disclaimer: "Fitness insights are generated by AI for informational tracking and motivation. Consult a certified coach or medical provider for tailored physical training."
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const text = await GeminiService._generateContentWithFallback(genAI, prompt);
      const parsed = GeminiService._parseJsonResponse(text);

      if (!parsed.disclaimer) {
        parsed.disclaimer = "Fitness insights are generated by AI for informational tracking and motivation.";
      }

      return parsed;
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return {
        performanceAnalysis: `Great work completing ${totalWorkouts} workouts! With an average duration of ${averageWorkoutDuration} minutes and ${caloriesBurned} total calories burned, you are demonstrating strong consistency.`,
        improvementSuggestions: [
          "Try incorporating progressive overload by gradually increasing duration or weight every 2 weeks.",
          "Balance high-intensity sessions with adequate low-intensity recovery training."
        ],
        motivationalAdvice: `Burning ${caloriesBurned} calories takes dedication! Keep pushing towards your next milestone.`,
        progressSummary: `Overall Trajectory: Excellent momentum across ${totalWorkouts} recorded training sessions.`,
        disclaimer: "Fitness insights are generated by AI for informational tracking and motivation. Consult a certified coach or medical provider for tailored physical training."
      };
    }
  }
}

module.exports = GeminiService;
