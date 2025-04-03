const express = require('express');
const router = express.Router();

// Import controller with more detailed error logging
try {
  const userController = require('../controllers/userController');
  
  // Debug log to check what we're getting
  console.log('userController contents:', userController);
  
  // Basic route handlers
  router.post('/register', async (req, res) => {
    try {
      await userController.register(req, res);
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      await userController.login(req, res);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

} catch (err) {
  console.error('Critical error loading controller:', err);
  router.post('/register', (req, res) => res.status(500).json({ error: 'Service unavailable' }));
  router.post('/login', (req, res) => res.status(500).json({ error: 'Service unavailable' }));
}

module.exports = router;