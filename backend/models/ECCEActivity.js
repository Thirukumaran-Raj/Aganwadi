const mongoose = require('mongoose');

const ecceActivitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null,
  },
  activity: {
    type: String,
    required: true,
    trim: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
  }],
  remarks: {
    type: String,
    default: '',
  },
  photos: [{
    type: String,
    default: '',
  }],
}, {
  timestamps: true,
});

const ECCEActivity = mongoose.model('ECCEActivity', ecceActivitySchema);
module.exports = ECCEActivity;
