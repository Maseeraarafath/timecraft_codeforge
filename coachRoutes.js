const express = require('express');
const coachController = require('../controllers/coachController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Coaching routes
router.post('/advice', coachController.getCoachingAdvice);
router.post('/goal-setting', coachController.getGoalSettingAdvice);
router.get('/daily-tip', coachController.getDailyTip);

module.exports = router;
