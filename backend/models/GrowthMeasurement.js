const mongoose = require('mongoose');

const growthMeasurementSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ageInMonths: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  muac: {
    type: Number,
    default: null,
  },
  remarks: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Normal', 'Underweight', 'Stunted', 'Wasted', 'SAM', 'MAM'],
    default: 'Normal',
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const GrowthMeasurement = mongoose.model('GrowthMeasurement', growthMeasurementSchema);
module.exports = GrowthMeasurement;
