const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  career: {
    type: String,
    default: 'frontend-developer'
  },
  level: {
    type: String,
    default: 'intermediate'
  },
  hours: {
    type: Number,
    default: 15
  },
  skills: {
    type: [String],
    default: []
  },
  activeRoadmap: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  checklistProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  chatHistory: {
    type: [
      {
        sender: String,
        text: String,
        time: String
      }
    ],
    default: []
  },
  streakCount: {
    type: Number,
    default: 1
  },
  lastActiveDate: {
    type: String,
    default: ''
  },
  careerRecommendations: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  apiKey: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  minimize: false
});

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password helper
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object without password
UserSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
