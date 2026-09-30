const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(authMiddleware);

router.post('/recommendation', AIController.getRecommendation);
router.post('/insights', AIController.getInsights);

module.exports = router;
