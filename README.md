# FitSense AI / FitTrack AI Backend Service

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v8-brightgreen.svg)](https://mongoosejs.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20SDK-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-ISC-purple.svg)](LICENSE)

A production-grade, secure RESTful backend API for **FitSense AI / FitTrack AI**, a modern intelligent fitness tracking application. Built with Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, and Google Gemini AI following Model-View-Controller (MVC) architectural best practices.

---

## 1. Project Title
**FitSense AI / FitTrack AI Backend API**

## 2. Project Description
FitSense AI is a full-featured fitness tracking backend that empowers users to register, log in securely, track their daily workout records, search historical routines, and receive personalized AI recommendations and performance insights powered by Google Gemini AI models.

## 3. Problem Statement
Individuals tracking their physical fitness often struggle to maintain consistency due to fragmented workout records, a lack of clear performance analytics, and missing personalized guidance. Standard fitness apps provide static logging without actionable intelligence. FitSense AI solves this problem by pairing secure user workout tracking with Google Gemini AI to analyze user statistics, deliver personalized weekly exercise plans, and produce actionable performance feedback.

---

## 4. Key Features
* 🔐 **Secure User Authentication**: JWT token generation and verification, salted password hashing using `bcryptjs`.
* 🏋️ **Complete Workout CRUD**: Create, read, update, and delete workout logs.
* 🛡️ **User Isolation & Data Privacy**: Middleware-enforced authorization ensuring users can strictly access, modify, or delete only their own records.
* 🔍 **Multi-Filter Workout Search**: Search workouts by workout name, category, or specific workout date with combined parameter support.
* 🤖 **AI Workout Recommendation Engine**: Generates personalized exercise routines, safety recommendations, and weekly schedules based on user age, goals, and experience level using Google Gemini AI.
* 📊 **AI Fitness Insights Generator**: Analyzes workout count, average duration, and calorie expenditure to provide performance evaluations and progress summaries.
* ⚙️ **Resilient Database Layer**: Built-in fallback to `mongodb-memory-server` if local MongoDB daemon is offline, guaranteeing out-of-the-box runnability.
* 🧪 **Automated Testing Suite**: Includes an end-to-end integration test runner validating all endpoints and security boundaries.

---

## 5. Technologies Used
* **Runtime**: Node.js (v20+)
* **Framework**: Express.js
* **Database**: MongoDB & Mongoose ORM
* **Authentication**: JSON Web Tokens (`jsonwebtoken`)
* **Security**: `bcryptjs` for password hashing, CORS middleware for cross-origin requests
* **AI Integration**: Google Gemini AI (`@google/generative-ai`)
* **Environment Management**: `dotenv`
* **Development & Testing**: `nodemon`, `mongodb-memory-server`

---

## 6. Architecture & Design Pattern
The project strictly follows the **Model-View-Controller (MVC)** design pattern with clear separation of concerns across layered components:

```
                  ┌──────────────────────┐
                  │    HTTP Client /     │
                  │   Postman / React    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Express Server    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌──────────────────────┐           ┌──────────────────────┐
│   Auth Middleware    │           │   Error Middleware   │
└──────────┬───────────┘           └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│     Controllers      │
└──────────┬───────────┘
           │
  ┌────────┴────────┬─────────────────────────┐
  ▼                 ▼                         ▼
┌───────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ Mongoose      │ │ Gemini Service    │ │ JWT & Password    │
│ Models        │ │ (Google AI API)   │ │ Services          │
└───────┬───────┘ └───────────────────┘ └───────────────────┘
        │
        ▼
┌───────────────┐
│ MongoDB Database              │
└───────────────┘
```

---

## 7. Folder Structure
```text
FitsenseAPI/
├── config/
│   └── db.js                 # MongoDB database connection setup & fallback
├── controllers/
│   ├── authController.js     # User registration, login, profile logic
│   ├── workoutController.js  # Workout CRUD & search controllers
│   └── aiController.js       # AI recommendations and insights controllers
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token authentication middleware
│   └── errorMiddleware.js    # Global error & exception handler middleware
├── models/
│   ├── User.js               # User Mongoose schema & validation
│   └── Workout.js            # Workout Mongoose schema & validation
├── routes/
│   ├── authRoutes.js         # /api/auth endpoint routes
│   ├── workoutRoutes.js      # /api/workouts endpoint routes
│   └── aiRoutes.js           # /api/ai endpoint routes
├── services/
│   ├── geminiService.js      # Google Gemini AI prompts & API handler
│   ├── jwtService.js         # JWT signing & verification service
│   └── passwordService.js    # Bcrypt hashing & password comparison
├── utils/
│   └── response.js           # Standardized JSON API response formatter
├── .env                      # Environment variables configuration
├── .gitignore                # Git ignored files configuration
├── endpoints.txt             # Endpoint examples and payloads
├── package.json              # App dependencies & scripts
├── package-lock.json         # Locked dependencies
├── postman_collection.json   # Ready-to-import Postman API Collection
├── README.md                 # Comprehensive project documentation
├── server.js                 # Main Express application entry point
└── test_runner.js            # End-to-end automated API test suite
```

---

## 8. Installation Requirements
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) OR MongoDB Atlas URI. *(Note: If MongoDB is not installed locally, the server automatically starts an in-memory database for seamless zero-setup testing).*

---

## 9. Installation Commands

1. **Clone the repository / navigate to project root**:
   ```bash
   cd FitsenseAPI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 10. Environment Variables
Create a `.env` file in the project root directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aifittrack
JWT_SECRET=change_this_secret_key_fitsense_ai_2026
GEMINI_API_KEY=your_google_gemini_api_key
```

> **Security Note**: Never commit your `.env` file or actual API secrets to public version control. `.env` is listed in `.gitignore`.

---

## 11. How to Start MongoDB

* **Option A: Local MongoDB Community Service**
  * Windows: `net start MongoDB`
  * macOS: `brew services start mongodb-community`
  * Linux: `sudo systemctl start mongod`

* **Option B: Automatic In-Memory Fallback**
  * If MongoDB is not running locally, the server will automatically launch an in-memory MongoDB database instance (`mongodb-memory-server`) during startup so you can immediately run and test the app without manual database setup.

---

## 12. How to Start the Backend

* **Production Mode**:
  ```bash
  npm start
  ```

* **Development Mode (with auto-reload via Nodemon)**:
  ```bash
  npm run dev
  ```

* **Run Automated End-to-End Test Suite**:
  ```bash
  node test_runner.js
  ```

---

## 13. API Endpoint Summary

| HTTP Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System health check |
| **POST** | `/api/auth/register` | Public | Register a new user account |
| **POST** | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| **GET** | `/api/auth/profile` | Protected | Retrieve authenticated user profile |
| **POST** | `/api/workouts` | Protected | Create a new workout record for authenticated user |
| **GET** | `/api/workouts` | Protected | Retrieve all workouts belonging to user |
| **GET** | `/api/workouts/search` | Protected | Search workouts by name, category, or date |
| **GET** | `/api/workouts/:id` | Protected | Retrieve specific workout by ID (Owner only) |
| **PUT** | `/api/workouts/:id` | Protected | Update existing workout record (Owner only) |
| **DELETE** | `/api/workouts/:id` | Protected | Delete existing workout record (Owner only) |
| **POST** | `/api/ai/recommendation` | Protected | Generate AI workout recommendations via Gemini |
| **POST** | `/api/ai/insights` | Protected | Generate AI performance insights via Gemini |

---

## 14. Example Requests & 15. Example Responses

### 1. User Registration (`POST /api/auth/register`)
* **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65142a1b9c3f2e1a8b4c5d6e",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

### 2. User Login (`POST /api/auth/login`)
* **Request**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65142a1b9c3f2e1a8b4c5d6e",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

### 3. Create Workout (`POST /api/workouts`)
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Request**:
  ```json
  {
    "workoutName": "Morning Running",
    "category": "Cardio",
    "duration": 45,
    "caloriesBurned": 350,
    "workoutDate": "2026-09-26"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Workout created successfully",
    "data": {
      "_id": "65142b9c9c3f2e1a8b4c5d70",
      "user": "65142a1b9c3f2e1a8b4c5d6e",
      "workoutName": "Morning Running",
      "category": "Cardio",
      "duration": 45,
      "caloriesBurned": 350,
      "workoutDate": "2026-09-26T00:00:00.000Z",
      "createdAt": "2026-09-28T22:00:00.000Z",
      "updatedAt": "2026-09-28T22:00:00.000Z"
    }
  }
  ```

---

### 4. Search Workouts (`GET /api/workouts/search?name=running&category=cardio`)
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Search results retrieved successfully",
    "data": [
      {
        "_id": "65142b9c9c3f2e1a8b4c5d70",
        "user": "65142a1b9c3f2e1a8b4c5d6e",
        "workoutName": "Morning Running",
        "category": "Cardio",
        "duration": 45,
        "caloriesBurned": 350,
        "workoutDate": "2026-09-26T00:00:00.000Z"
      }
    ]
  }
  ```

---

### 5. AI Workout Recommendation (`POST /api/ai/recommendation`)
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Request**:
  ```json
  {
    "age": 25,
    "fitnessGoal": "Weight loss",
    "experienceLevel": "Beginner"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "AI workout recommendation generated successfully",
    "data": {
      "personalizedPlan": "Customized Beginner level plan focused on Weight loss for a 25-year-old individual.",
      "weeklySuggestions": [
        { "day": "Day 1", "focus": "Upper Body Strength", "routine": "Pushups, Dumbbell Press (30 mins)" },
        { "day": "Day 2", "focus": "Cardio & Core", "routine": "Brisk walking or jogging + Plank circuits (35 mins)" },
        { "day": "Day 3", "focus": "Rest & Recovery", "routine": "Light stretching and hydration" }
      ],
      "suggestedExercises": [
        { "name": "Bodyweight Squats", "sets": 3, "reps": "12-15", "notes": "Keep chest up" }
      ],
      "trainingTips": [
        "Maintain consistent sleep (7-8 hours) for optimal recovery."
      ],
      "safetyRecommendations": [
        "Always perform a 5-minute dynamic warm-up before workout."
      ],
      "motivationalGuidance": "Stay focused on your Weight loss goal!",
      "disclaimer": "These recommendations provide general fitness guidance and are not a substitute for professional medical advice. Consult a healthcare professional before starting any new fitness program."
    }
  }
  ```

---

## 16. Postman Testing Instructions

1. Open **Postman**.
2. Click **Import** -> Select `postman_collection.json` located in the root of this project repository.
3. Execute requests in order:
   1. `1. Register User`
   2. `2. Login User` -> Copy the returned `token`.
   3. `3. Get Profile` -> Paste token under Authorization Header (`Bearer <TOKEN>`).
   4. `4. Add Workout` -> Note the returned `_id`.
   5. `5. Get All Workouts`
   6. `6. Get Workout By ID`
   7. `7. Search Workouts`
   8. `8. Update Workout`
   9. `9. Delete Workout`
   10. `10. Workout Recommendation`
   11. `11. Fitness Insights`

---

## 17. Google Gemini Configuration
To enable live AI generation:
1. Obtain an API key from Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Add your key to `server/.env`:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualApiKeyHere
   ```
3. Restart the server. The `geminiService.js` module uses `@google/generative-ai` with structured JSON prompt engineering and automatic fallback handlers.

---

## 18. Security Notes
* **Passwords**: Encrypted with `bcryptjs` using 10 salt rounds. Plaintext or hashed passwords are stripped from responses using `toJSON()` hooks.
* **API Protection**: JWT middleware blocks unauthenticated access (returns `401 Unauthorized`).
* **User Isolation**: All workout queries filter strictly by `req.user.id`. Modifying or requesting another user's workout ID triggers `403 Forbidden`.
* **Input Validation**: Sanitize inputs, enforce minimum password lengths, and check positive durations/calories to prevent database pollution.

---

## 19. Future Enhancements
* 📈 **Visual Progress Analytics**: Integration with Chart.js / Recharts for visual progress dashboards.
* 🥗 **AI Nutrition & Calorie Planner**: Expanding Gemini AI services to generate meal plans aligned with workout output.
* 📲 **Push Notifications & Reminders**: Integrating Web Push API for daily workout reminders.
* ⌚ **Wearable SDK Sync**: Connecting Apple HealthKit / Google Fit SDK for automatic data sync.
