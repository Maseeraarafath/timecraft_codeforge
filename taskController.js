const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// Calculate priority score based on various factors
const calculatePriorityScore = async (task, userId) => {
  // Factors to consider: due date proximity, estimated time, user-defined priority, task dependencies
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const now = new Date();
  
  let urgencyScore = 0;
  if (dueDate) {
    const timeLeft = dueDate - now;
    const daysLeft = timeLeft / (1000 * 60 * 60 * 24);
    // Higher score for tasks due sooner
    urgencyScore = daysLeft <= 0 ? 100 : Math.max(0, 100 - daysLeft * 10);
  }
  
  // Get user's completed tasks to learn from patterns
  const completedTasks = await Task.find({ 
    userId: userId, 
    status: 'completed',
    completedAt: { $exists: true }
  }).sort({ completedAt: -1 }).limit(20);
  
  // Learn from past task completion patterns (basic RL approach)
  let importanceScore = 0;
  if (completedTasks.length > 0) {
    // Calculate average priority of completed tasks
    const avgPriority = completedTasks.reduce((sum, t) => sum + (t.priority.manual || 3), 0) / completedTasks.length;
    // Reward tasks similar to what user typically completes
    importanceScore = task.priority.manual ? Math.min(100, task.priority.manual * (100 / avgPriority)) : 50;
  } else {
    importanceScore = task.priority.manual ? task.priority.manual * 20 : 50;
  }
  
  // Final score is weighted combination
  return Math.round((urgencyScore * 0.6) + (importanceScore * 0.4));
};

// Task controller methods
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id
    });
    
    // Calculate initial priority score
    task.priority.score = await calculatePriorityScore(task, req.user.id);
    
    await task.save();
    
    // Log task creation
    await new ActivityLog({
      userId: req.user.id,
      taskId: task._id,
      actionType: 'task_created'
    }).save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    const query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    let tasks = await Task.find(query);
    
    // Recalculate priority scores for all pending tasks
    for (let task of tasks) {
      if (task.status === 'pending' || task.status === 'in-progress') {
        task.priority.score = await calculatePriorityScore(task, req.user.id);
        await task.save();
      }
    }
    
    // Sort by priority score if requested
    if (sortBy === 'priority') {
      tasks.sort((a, b) => b.priority.score - a.priority.score);
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    Object.assign(task, req.body);
    task.priority.score = await calculatePriorityScore(task, req.user.id);
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task status and completion time
    task.status = 'completed';
    task.completedAt = new Date();
    
    // Calculate reward points based on priority and completion time
    const baseReward = task.priority.score / 10;
    const onTimeBonus = task.dueDate && task.completedAt <= task.dueDate ? 10 : 0;
    task.reward = Math.round(baseReward + onTimeBonus);
    
    await task.save();
    
    // Add points to user
    const user = await User.findById(req.user.id);
    user.rewards.points += task.reward;
    
    // Level up logic (simple example)
    const nextLevelThreshold = user.rewards.level * 100;
    if (user.rewards.points >= nextLevelThreshold) {
      user.rewards.level += 1;
    }
    
    await user.save();
    
    // Log task completion
    await new ActivityLog({
      userId: req.user.id,
      taskId: task._id,
      actionType: 'task_completed',
      metadata: { earnedPoints: task.reward }
    }).save();
    
    res.json({ task, rewards: user.rewards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};