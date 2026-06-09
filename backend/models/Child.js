const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  // We link the child to the specific worker who registered them
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  // An array to keep a history of health checkups
  healthLogs: [{
    date: { type: Date, default: Date.now },
    weight: { type: Number }, // in kg
    height: { type: Number }, // in cm
    notes: { type: String }
  }]
}, {
  timestamps: true,
});

const Child = mongoose.model('Child', childSchema);
module.exports = Child;