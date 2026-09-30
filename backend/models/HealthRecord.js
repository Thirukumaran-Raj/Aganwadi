const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  healthWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  observations: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  illness: {
    type: String,
    default: '',
  },
  treatment: {
    type: String,
    default: '',
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  referralNeeded: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = HealthRecord;
