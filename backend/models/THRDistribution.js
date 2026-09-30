const mongoose = require('mongoose');

const thrDistributionSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  distributionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  recipient: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Distributed', 'Cancelled'],
    default: 'Pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  distributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const THRDistribution = mongoose.model('THRDistribution', thrDistributionSchema);
module.exports = THRDistribution;
