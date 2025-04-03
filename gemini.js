// Import required dependencies
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Load API key from environment variables - NEVER hardcode API keys in your code
// Add this to your .env file: GEMINI_API_KEY=your_api_key_here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to process the template
const processTemplate = (template, data) => {
  // Simple template processing (in production, you might want to use a proper template engine)
  let result = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  return result;
};

// Endpoint to generate content with Gemini
router.post('/generate', async (req, res) => {
  try {
    const userData = req.body;
    
    // Prepare the context for Gemini
    const userContext = {
      user_name: userData.user?.name || 'User',
      user_level: userData.user?.level || 1,
      user_points: userData.user?.points || 0,
      work_start: userData.user?.preferences?.workHours?.start || 9,
      work_end: userData.user?.preferences?.workHours?.end || 17,
      focus_time_minutes: userData.user?.preferences?.focusTime || 25,
      completion_rate: userData.analytics?.completionRate || 0,
      focus_hours: userData.analytics?.focusHours || 0,
      productive_hours: userData.analytics?.productiveHours?.join(',') || '',
      productive_days: userData.analytics?.productiveDays?.join(',') || '',
      user_query: userData.context || 'Help me organize my tasks'
    };

    // Process pending tasks
    if (userData.tasks?.pending) {
      userContext.pending_tasks = userData.tasks.pending.map(task => ({
        title: task.title,
        priority: task.priority,
        due_date: task.dueDate,
        time_minutes: task.estimatedTime
      }));
    }

    // Process completed tasks
    if (userData.tasks?.completed) {
      userContext.completed_tasks = userData.tasks.completed.map(task => ({
        title: task.title,
        completed_at: task.completedAt
      }));
    }

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Send prompt to Gemini
    const prompt = `You're a productivity assistant helping with task management.
    User information: ${JSON.stringify(userContext)}
    The user is asking: "${userContext.user_query}"
    Provide a helpful response considering their tasks, work hours, and productivity patterns.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      response: text 
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;