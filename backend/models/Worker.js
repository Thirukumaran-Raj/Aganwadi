const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Anganwadi Worker', 'Anganwadi Helper', 'Supervisor', 'CDPO', 'State Admin', 'District Admin'],
    default: 'Anganwadi Worker',
  },
  mobile: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  dateOfJoining: {
    type: Date,
    default: null,
  },
  assignedCentre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  state: {
    type: String,
    trim: true,
    default: '',
  },
  district: {
    type: String,
    trim: true,
    default: '',
  },
  block: {
    type: String,
    trim: true,
    default: '',
  },
  sector: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Transferred', 'On Leave'],
    default: 'Active',
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
