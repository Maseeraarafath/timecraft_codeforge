const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.getCoachingAdvice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { context } = req.body; // Optional context from the user
    
    // Get user data
    const user = await User.findById(userId);
    
    // Get pending tasks
    const pendingTasks = await Task.find({ 
      userId,
      status: { $in: ['pending', 'in-progress'] }
    }).sort({ 'priority.score': -1 }).limit(5);
    
    // Get recently completed tasks
    const completedTasks = await Task.find({
      userId,
      status: 'completed',
      completedAt: { $exists: true }
    }).sort({ completedAt: -1 }).limit(5);
    
    // Get recent activity logs
    const recentActivity = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Calculate productivity metrics
    const taskCompletionRate = await calculateCompletionRate(userId);
    
    // Format data for the AI coach
    const userLevel = user.rewards.level;
    const userPoints = user.rewards.points;
    
    // Use Gemini AI to generate coaching advice
    const genAI = req.app.locals.genAI;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    You are a personalized productivity coach. Based on the following user data, provide actionable advice to help them improve their productivity:
    
    User Level: ${userLevel}
    Reward Points: ${userPoints}
    Task Completion Rate: ${taskCompletionRate}%
    
    Top Priority Tasks:
    ${pendingTasks.map(task => `- ${task.title} (Priority Score: ${task.priority.score})`).join('\n')}
    
    Recently Completed Tasks:
    ${completedTasks.map(task => `- ${task.title}`).join('\n')}
    
    User Context: ${context || 'No specific context provided'}
    
    Provide a motivational, encouraging, and practical response that addresses:
    1. Recognition of recent achievements
    2. Specific advice for tackling high-priority pending tasks
    3. A productivity tip relevant to their current situation
    4. A small actionable challenge to improve productivity
    
    Keep your response conversational, engaging, and limited to 3-4 paragraphs.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coachingAdvice = response.text();
    
    res.json({ 
      advice: coachingAdvice,
      stats: {
        level: userLevel,
        points: userPoints,
        completionRate: taskCompletionRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions for analytics
const calculateCompletionRate = async (userId, startDate = null, endDate = null) => {
  const query = { userId };
  if (startDate && endDate) {
    query.createdAt = { $gte: startDate, $lte: endDate };
  }
  
  const totalTasks = await Task.countDocuments(query);
  
  if (totalTasks === 0) return 0;
  
  const completedQuery = { ...query, status: 'completed' };
  const completedTasks = await Task.countDocuments(completedQuery);
  
  return Math.round((completedTasks / totalTasks) * 100);
};

const calculateFocusHours = (activityLogs) => {
  let totalMinutes = 0;
  
  // Group session start and end logs
  const sessions = [];
  const startLogs = activityLogs.filter(log => log.actionType === 'session_start');
  const endLogs = activityLogs.filter(log => log.actionType === 'session_end');
  
  // Match start and end sessions
  for (const startLog of startLogs) {
    const matchingEndLog = endLogs.find(endLog => 
      endLog.timestamp > startLog.timestamp && 
      (!endLog.metadata?.sessionId || endLog.metadata?.sessionId === startLog.metadata?.sessionId)
    );
    
    if (matchingEndLog) {
      const durationMinutes = (matchingEndLog.timestamp - startLog.timestamp) / (1000 * 60);
      totalMinutes += durationMinutes;
    }
  }
  
  return Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
};

const groupTasksByDay = (tasks) => {
  const tasksByDay = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (const task of tasks) {
    if (task.completedAt) {
      const dayOfWeek = days[task.completedAt.getDay()];
      tasksByDay[dayOfWeek] = (tasksByDay[dayOfWeek] || 0) + 1;
    }
  }
  
  return tasksByDay;
};

const calculateProductiveHours = (activityLogs) => {
  const productiveHours = {};
  
  for (const log of activityLogs) {
    if (log.actionType === 'task_completed') {
      const hour = log.timestamp.getHours();
      productiveHours[hour] = (productiveHours[hour] || 0) + 1;
    }
  }
  
  return productiveHours;
};