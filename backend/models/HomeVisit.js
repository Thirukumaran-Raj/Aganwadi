const mongoose = require('mongoose');

const homeVisitSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null,
  },
  visitType: {
    type: String,
    default: 'Routine',
  },
  scheduledDate: {
    type: Date,
    default: null,
  },
  completedDate: {
    type: Date,
    default: null,
  },
  purpose: {
    type: String,
    default: '',
  },
  observations: {
    type: String,
    default: '',
  },
  counselling: {
    type: String,
    default: '',
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  nextVisitDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Missed', 'Cancelled', 'Follow-up Required'],
    default: 'Scheduled',
  },
}, {
  timestamps: true,
});

const HomeVisit = mongoose.model('HomeVisit', homeVisitSchema);
module.exports = HomeVisit;
