const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  estimatedTime: { type: Number }, // minutes
  priority: { 
    score: { type: Number, default: 0 }, // calculated by AI
    manual: { type: Number, min: 1, max: 5 } // user-defined priority
  },
  tags: [String],
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'deferred'], 
    default: 'pending' 
  },
  completedAt: { type: Date },
  reward: { type: Number, default: 0 }, // points earned upon completion
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);