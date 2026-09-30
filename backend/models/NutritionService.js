const mongoose = require('mongoose');

const nutritionServiceSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  service: {
    type: String,
    required: true,
    enum: ['Supplementary Nutrition', 'Take Home Ration', 'Hot Cooked Meal'],
  },
  item: {
    type: String,
    trim: true,
    default: '',
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Distributed', 'Partially Distributed', 'Skipped'],
    default: 'Pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  distributionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const NutritionService = mongoose.model('NutritionService', nutritionServiceSchema);
module.exports = NutritionService;
