const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Analytics routes
router.get('/weekly', analyticsController.getWeeklyAnalytics);
router.get('/monthly', analyticsController.getMonthlyAnalytics);
router.get('/productivity-score', analyticsController.getProductivityScore);
router.get('/habits', analyticsController.getHabitAnalysis);

module.exports = router;