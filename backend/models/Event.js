const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  participants: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  photos: [{
    type: String,
    default: '',
  }],
  documents: [{
    type: String,
    default: '',
  }],
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
