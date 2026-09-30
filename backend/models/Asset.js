const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  assetName: {
    type: String,
    required: true,
    trim: true,
  },
  serialNumber: {
    type: String,
    default: '',
    trim: true,
  },
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  purchaseDate: {
    type: Date,
    default: null,
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'],
    default: 'Good',
  },
  warranty: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Active', 'Assigned', 'Maintenance', 'Retired'],
    default: 'Active',
  },
  assignedPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
