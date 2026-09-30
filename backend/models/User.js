const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'worker',
    trim: true,
  },
  centerId: {
    type: String,
    trim: true,
  },
  employeeId: {
    type: String,
    trim: true,
    index: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Transferred'],
    default: 'Active',
  },
  state: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  block: {
    type: String,
    trim: true,
  },
  sector: {
    type: String,
    trim: true,
  },
  assignedCentre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
  }],
  language: {
    type: String,
    enum: ['en', 'ta'],
    default: 'en',
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Encrypt the password before saving the user to the database
userSchema.pre('save', async function () {
  // If the password isn't being modified, move on
  if (!this.isModified('password')) {
    return;
  }
  // Generate a 'salt' and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a custom method to check if a login password matches the hashed database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;