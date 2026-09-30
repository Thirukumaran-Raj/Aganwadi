const mongoose = require('mongoose');

const developmentalMilestoneSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  domain: {
    type: String,
    enum: ['Gross Motor', 'Fine Motor', 'Language', 'Cognitive', 'Social Emotional', 'Self Help'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Achieved', 'Developing', 'Concern', 'Referral Required'],
    default: 'Developing',
  },
  notes: {
    type: String,
    default: '',
  },
  assessedDate: {
    type: Date,
    default: Date.now,
  },
  assessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const DevelopmentalMilestone = mongoose.model('DevelopmentalMilestone', developmentalMilestoneSchema);
module.exports = DevelopmentalMilestone;
