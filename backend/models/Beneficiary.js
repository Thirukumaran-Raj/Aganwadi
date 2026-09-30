const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  beneficiaryId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Child', 'Pregnant Woman', 'Lactating Mother', 'Adolescent Girl'],
    default: 'Child',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Female',
  },
  dob: {
    type: Date,
    default: null,
  },
  age: {
    type: Number,
    default: 0,
  },
  fatherName: {
    type: String,
    default: '',
    trim: true,
  },
  motherName: {
    type: String,
    default: '',
    trim: true,
  },
  guardian: {
    type: String,
    default: '',
    trim: true,
  },
  mobile: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  state: {
    type: String,
    default: '',
    trim: true,
  },
  district: {
    type: String,
    default: '',
    trim: true,
  },
  block: {
    type: String,
    default: '',
    trim: true,
  },
  village: {
    type: String,
    default: '',
    trim: true,
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
    enum: ['Active', 'Inactive', 'Transferred', 'Deactivated'],
    default: 'Active',
  },
  photo: {
    type: String,
    default: '',
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);
module.exports = Beneficiary;
