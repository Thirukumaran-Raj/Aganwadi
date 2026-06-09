const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['worker', 'admin'],
    default: 'worker',
  },
  centerId: {
    type: String, 
    // This will be useful later to assign a worker to a specific Anganwadi center
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Encrypt the password before saving the user to the database
userSchema.pre('save', async function (next) {
  // If the password isn't being modified, move on
  if (!this.isModified('password')) {
    next();
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