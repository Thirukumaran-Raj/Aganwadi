const mongoose = require('mongoose');

const anganwadiCentreSchema = new mongoose.Schema({
  awcId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  awcCode: {
    type: String,
    trim: true,
    default: '',
  },
  centreName: {
    type: String,
    required: true,
    trim: true,
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
  village: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  pinCode: {
    type: String,
    trim: true,
    default: '',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  centreType: {
    type: String,
    default: 'General',
  },
  openingDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Review', 'Deactivated'],
    default: 'Active',
  },
  infrastructure: {
    buildingAvailable: { type: Boolean, default: false },
    electricity: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    toilet: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    storage: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    smartphone: { type: Boolean, default: false },
    weighingEquipment: { type: Boolean, default: false },
    heightMeasurementEquipment: { type: Boolean, default: false },
    learningMaterials: { type: Boolean, default: false },
    playground: { type: Boolean, default: false },
    poshanVatika: { type: Boolean, default: false },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const AnganwadiCentre = mongoose.model('AnganwadiCentre', anganwadiCentreSchema);
module.exports = AnganwadiCentre;
