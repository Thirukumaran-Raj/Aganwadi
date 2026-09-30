const mongoose = require('mongoose');

const lactatingMotherSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  deliveryDate: {
    type: Date,
    default: null,
  },
  infantAgeInMonths: {
    type: Number,
    default: 0,
  },
  feedingMethod: {
    type: String,
    enum: ['Exclusive Breastfeeding', 'Mixed Feeding', 'Formula Feeding'],
    default: 'Exclusive Breastfeeding',
  },
  nutritionStatus: {
    type: String,
    enum: ['Good', 'Moderate', 'Poor'],
    default: 'Good',
  },
  postpartumVisitDone: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'High Risk', 'Recovered'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

const LactatingMother = mongoose.model('LactatingMother', lactatingMotherSchema);
module.exports = LactatingMother;
