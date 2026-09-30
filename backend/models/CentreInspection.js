const mongoose = require('mongoose');

const centreInspectionSchema = new mongoose.Schema({
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    required: true,
  },
  inspectionDate: {
    type: Date,
    default: Date.now,
  },
  inspectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  checklist: {
    centreOpened: { type: Boolean, default: false },
    workerPresent: { type: Boolean, default: false },
    helperPresent: { type: Boolean, default: false },
    cleanliness: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    toilet: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    foodStock: { type: Boolean, default: false },
    learningMaterials: { type: Boolean, default: false },
    growthEquipment: { type: Boolean, default: false },
    attendanceRecords: { type: Boolean, default: false },
    nutritionRecords: { type: Boolean, default: false },
    ecceActivities: { type: Boolean, default: false },
    infrastructure: { type: Boolean, default: false },
  },
  remarks: {
    type: String,
    default: '',
  },
  correctiveAction: {
    type: String,
    default: '',
  },
  followUpDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const CentreInspection = mongoose.model('CentreInspection', centreInspectionSchema);
module.exports = CentreInspection;
