const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  reason: {
    type: String,
    default: '',
  },
  referredFacility: {
    type: String,
    default: '',
  },
  referralDate: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Referred', 'Visited', 'Follow-up', 'Closed'],
    default: 'Pending',
  },
  followUpDate: {
    type: Date,
    default: null,
  },
  outcome: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
