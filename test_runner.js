const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { startServer } = require('./server');

// Helper for making HTTP requests to test server
function makeRequest(port, options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Comprehensive API Tests for FitSense AI Backend ---');
  
  // Start server and await database connection
  const server = await startServer();
  const PORT = process.env.PORT || 5000;

  let user1Token = '';
  let user2Token = '';
  let workout1Id = '';

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check Test
    console.log('\n--- 1. System Health Check ---');
    const health = await makeRequest(PORT, { path: '/api/health', method: 'GET' });
    assert(health.statusCode === 200 && health.body.status === 'UP', 'Health check endpoint returns status UP');

    // 2. Authentication Tests
    console.log('\n--- 2. Authentication & User Management ---');
    
    // Register User 1
    const user1Email = `john_${Date.now()}@example.com`;
    const regRes1 = await makeRequest(PORT, { path: '/api/auth/register', method: 'POST' }, {
      name: 'John Doe',
      email: user1Email,
      password: 'password123'
    });
    assert(regRes1.statusCode === 201 && regRes1.body.success && regRes1.body.token, 'User 1 Registration successful');
    user1Token = regRes1.body.token;

    // Register User 2 (For User Isolation Testing)
    const user2Email = `jane_${Date.now()}@example.com`;
    const regRes2 = await makeRequest(PORT, { path: '/api/auth/register', method: 'POST' }, {
      name: 'Jane Smith',
      email: user2Email,
      password: 'password456'
    });
    assert(regRes2.statusCode === 201 && regRes2.body.success && regRes2.body.token, 'User 2 Registration successful');
    user2Token = regRes2.body.token;

    // Duplicate Registration Failure Test
    const dupRes = await makeRequest(PORT, { path: '/api/auth/register', method: 'POST' }, {
      name: 'Duplicate John',
      email: user1Email,
      password: 'password123'
    });
    assert(dupRes.statusCode === 409 && !dupRes.body.success, 'Duplicate email registration rejected with 409');

    // Login Test User 1
    const loginRes = await makeRequest(PORT, { path: '/api/auth/login', method: 'POST' }, {
      email: user1Email,
      password: 'password123'
    });
    assert(loginRes.statusCode === 200 && loginRes.body.token && loginRes.body.user.email === user1Email, 'User 1 Login successful');

    // Invalid Login Test
    const invalidLogin = await makeRequest(PORT, { path: '/api/auth/login', method: 'POST' }, {
      email: user1Email,
      password: 'wrongpassword'
    });
    assert(invalidLogin.statusCode === 401 && !invalidLogin.body.success, 'Invalid password rejected with 401');

    // Get Profile Test
    const profileRes = await makeRequest(PORT, {
      path: '/api/auth/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(profileRes.statusCode === 200 && profileRes.body.data.email === user1Email, 'Get User Profile successful');

    // Protected Route Access Without Token Test
    const unauthProfile = await makeRequest(PORT, { path: '/api/auth/profile', method: 'GET' });
    assert(unauthProfile.statusCode === 401 && !unauthProfile.body.success, 'Protected route without token rejected with 401');

    // 3. Workout CRUD Tests
    console.log('\n--- 3. Workout Management (CRUD) ---');

    // Create Workout 1 (User 1)
    const createW1 = await makeRequest(PORT, {
      path: '/api/workouts',
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      workoutName: 'Morning Running',
      category: 'Cardio',
      duration: 45,
      caloriesBurned: 350,
      workoutDate: '2026-09-26'
    });
    assert(createW1.statusCode === 201 && createW1.body.data.workoutName === 'Morning Running', 'User 1 Create Workout 1 successful');
    workout1Id = createW1.body.data._id;

    // Create Workout 2 (User 1)
    const createW2 = await makeRequest(PORT, {
      path: '/api/workouts',
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      workoutName: 'Evening Weightlifting',
      category: 'Strength',
      duration: 60,
      caloriesBurned: 450,
      workoutDate: '2026-09-27'
    });
    assert(createW2.statusCode === 201 && createW2.body.data.workoutName === 'Evening Weightlifting', 'User 1 Create Workout 2 successful');

    // Create Workout for User 2
    const createWUser2 = await makeRequest(PORT, {
      path: '/api/workouts',
      method: 'POST',
      headers: { Authorization: `Bearer ${user2Token}` }
    }, {
      workoutName: 'Jane Yoga',
      category: 'Flexibility',
      duration: 30,
      caloriesBurned: 120,
      workoutDate: '2026-09-28'
    });
    assert(createWUser2.statusCode === 201, 'User 2 Create Workout successful');

    // Get All Workouts for User 1
    const getAllW1 = await makeRequest(PORT, {
      path: '/api/workouts',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(getAllW1.statusCode === 200 && getAllW1.body.data.length === 2, 'Get All Workouts returns only User 1 workouts (Count: 2)');

    // Get Workout By ID
    const getByIdRes = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(getByIdRes.statusCode === 200 && getByIdRes.body.data.workoutName === 'Morning Running', 'Get Workout By ID successful');

    // 4. User Isolation & Security Verification
    console.log('\n--- 4. User Isolation & Security Enforcement ---');
    const unauthorizedAccess = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    assert(unauthorizedAccess.statusCode === 403, 'User 2 blocked with 403 when requesting User 1 workout ID');

    const unauthorizedUpdate = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${user2Token}` }
    }, { workoutName: 'Hacked Title' });
    assert(unauthorizedUpdate.statusCode === 403, 'User 2 blocked with 403 when updating User 1 workout ID');

    const unauthorizedDelete = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    assert(unauthorizedDelete.statusCode === 403, 'User 2 blocked with 403 when deleting User 1 workout ID');

    // 5. Search Workouts Tests
    console.log('\n--- 5. Workout Search & Filtering ---');
    const searchName = await makeRequest(PORT, {
      path: '/api/workouts/search?name=running',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(searchName.statusCode === 200 && searchName.body.data.length === 1 && searchName.body.data[0].workoutName === 'Morning Running', 'Search by name "running" successful');

    const searchCat = await makeRequest(PORT, {
      path: '/api/workouts/search?category=Strength',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(searchCat.statusCode === 200 && searchCat.body.data.length === 1 && searchCat.body.data[0].category === 'Strength', 'Search by category "Strength" successful');

    const searchDate = await makeRequest(PORT, {
      path: '/api/workouts/search?date=2026-09-26',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(searchDate.statusCode === 200 && searchDate.body.data.length === 1, 'Search by date "2026-09-26" successful');

    // 6. Update Workout Test
    console.log('\n--- 6. Update Workout ---');
    const updateRes = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      workoutName: 'Morning Sprint Running',
      duration: 50
    });
    assert(updateRes.statusCode === 200 && updateRes.body.data.workoutName === 'Morning Sprint Running' && updateRes.body.data.duration === 50, 'Update Workout successful');

    // 7. Delete Workout Test
    console.log('\n--- 7. Delete Workout ---');
    const deleteRes = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(deleteRes.statusCode === 200 && deleteRes.body.success, 'Delete Workout successful');

    const verifyDeleted = await makeRequest(PORT, {
      path: `/api/workouts/${workout1Id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(verifyDeleted.statusCode === 404, 'Deleted Workout no longer exists (404)');

    // 8. AI Integration Endpoints Tests
    console.log('\n--- 8. Google Gemini AI Services ---');

    // AI Workout Recommendation
    const aiRecRes = await makeRequest(PORT, {
      path: '/api/ai/recommendation',
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      age: 25,
      fitnessGoal: 'Weight loss',
      experienceLevel: 'Beginner'
    });
    assert(aiRecRes.statusCode === 200 && aiRecRes.body.success && aiRecRes.body.data.personalizedPlan && aiRecRes.body.data.disclaimer, 'AI Workout Recommendation API successful');

    // AI Fitness Insights
    const aiInsightRes = await makeRequest(PORT, {
      path: '/api/ai/insights',
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      totalWorkouts: 15,
      averageWorkoutDuration: 42,
      caloriesBurned: 5250
    });
    assert(aiInsightRes.statusCode === 200 && aiInsightRes.body.success && aiInsightRes.body.data.performanceAnalysis && aiInsightRes.body.data.disclaimer, 'AI Fitness Insights API successful');

    // 9. Validation & Error Handling Tests
    console.log('\n--- 9. Validation & Error Handling Edge Cases ---');
    
    // Invalid Duration (Negative/Zero)
    const invalidDuration = await makeRequest(PORT, {
      path: '/api/workouts',
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` }
    }, {
      workoutName: 'Invalid Workout',
      category: 'Cardio',
      duration: -10,
      caloriesBurned: 100,
      workoutDate: '2026-09-26'
    });
    assert(invalidDuration.statusCode === 400 && !invalidDuration.body.success, 'Negative workout duration rejected with 400');

    // Invalid ObjectId format
    const invalidIdRes = await makeRequest(PORT, {
      path: '/api/workouts/123invalidobjectid',
      method: 'GET',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    assert(invalidIdRes.statusCode === 400 && !invalidIdRes.body.success, 'Malformed ObjectId rejected with 400');

    console.log('\n========================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================\n');

    server.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test Execution Error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
