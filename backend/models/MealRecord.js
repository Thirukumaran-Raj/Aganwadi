const mongoose = require('mongoose');

const mealRecordSchema = new mongoose.Schema({
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
  menu: {
    type: String,
    trim: true,
    default: '',
  },
  foodItems: [{
    type: String,
    trim: true,
  }],
  quantityPrepared: {
    type: Number,
    default: 0,
    min: 0,
  },
  beneficiariesServed: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantityConsumed: {
    type: Number,
    default: 0,
    min: 0,
  },
  remarks: {
    type: String,
    default: '',
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const MealRecord = mongoose.model('MealRecord', mealRecordSchema);
module.exports = MealRecord;
