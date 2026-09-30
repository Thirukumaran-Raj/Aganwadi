const mongoose = require('mongoose');

const adolescentGirlSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 19,
  },
  schoolStatus: {
    type: String,
    enum: ['In School', 'Out of School', 'Dropped Out'],
    default: 'In School',
  },
  menstralHealthStatus: {
    type: String,
    enum: ['Normal', 'Irregular', 'Concern'],
    default: 'Normal',
  },
  anaemiaStatus: {
    type: String,
    enum: ['Normal', 'Mild', 'Moderate', 'Severe'],
    default: 'Normal',
  },
  counsellingStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Follow-up Needed'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const AdolescentGirl = mongoose.model('AdolescentGirl', adolescentGirlSchema);
module.exports = AdolescentGirl;
