const mongoose = require('mongoose');

const immunizationSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  vaccine: {
    type: String,
    required: true,
    trim: true,
  },
  dose: {
    type: String,
    trim: true,
    default: '',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  givenDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Due', 'Completed', 'Missed'],
    default: 'Upcoming',
  },
  healthFacility: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Immunization = mongoose.model('Immunization', immunizationSchema);
module.exports = Immunization;
