const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  parentName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    trim: true,
    default: '',
  },
  motherName: {
    type: String,
    trim: true,
    default: '',
  },
  guardian: {
    type: String,
    trim: true,
    default: '',
  },
  mobile: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
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
  village: {
    type: String,
    trim: true,
    default: '',
  },
  awc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Transferred', 'Deleted'],
    default: 'Active',
  },
  photo: {
    type: String,
    default: '',
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  healthLogs: [{
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    height: { type: Number },
    muac: { type: Number, default: null },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Normal', 'Underweight', 'Stunted', 'Wasted', 'SAM', 'MAM'],
      default: 'Normal',
    },
  }],
  growthStatus: {
    type: String,
    enum: ['Normal', 'Underweight', 'Stunted', 'Wasted', 'SAM', 'MAM'],
    default: 'Normal',
  },
  nutrition: [{
    date: Date,
    service: String,
    item: String,
    quantity: Number,
    status: String,
    remarks: String,
  }],
  immunization: [{
    vaccine: String,
    dose: String,
    dueDate: Date,
    givenDate: Date,
    status: {
      type: String,
      enum: ['Upcoming', 'Due', 'Completed', 'Missed'],
      default: 'Upcoming',
    },
    remarks: String,
  }]
}, {
  timestamps: true,
});

const Child = mongoose.model('Child', childSchema);
module.exports = Child;