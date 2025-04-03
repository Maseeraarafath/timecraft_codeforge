const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  actionType: { 
    type: String, 
    enum: ['task_created', 'task_started', 'task_completed', 'task_deferred', 'session_start', 'session_end'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);