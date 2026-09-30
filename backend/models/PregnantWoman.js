const mongoose = require('mongoose');

const pregnantWomanSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  pregnancyStage: {
    type: String,
    enum: ['First Trimester', 'Second Trimester', 'Third Trimester'],
    default: 'First Trimester',
  },
  expectedDeliveryDate: {
    type: Date,
    default: null,
  },
  lastMenstrualPeriod: {
    type: Date,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  bloodPressure: {
    type: String,
    default: '',
  },
  anaemiaStatus: {
    type: String,
    enum: ['Normal', 'Mild', 'Moderate', 'Severe'],
    default: 'Normal',
  },
  ironFolic: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'High Risk', 'Delivered', 'Referral'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

const PregnantWoman = mongoose.model('PregnantWoman', pregnantWomanSchema);
module.exports = PregnantWoman;
