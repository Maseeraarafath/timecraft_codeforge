const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    workHours: { start: Number, end: Number },
    focusTime: Number,
    dailyGoals: Number
  },
  rewards: {
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
  },
  createdAt: { type: Date, default: Date.now }
});

// 🔥 Fix: Prevent Model Overwrite
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
