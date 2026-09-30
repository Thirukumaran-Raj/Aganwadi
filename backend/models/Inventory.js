const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Nutrition', 'Medicine', 'Supplies', 'Education', 'First Aid', 'Equipment', 'Furniture'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  openingStock: {
    type: Number,
    default: 0,
  },
  received: {
    type: Number,
    default: 0,
  },
  distributed: {
    type: Number,
    default: 0,
  },
  damaged: {
    type: Number,
    default: 0,
  },
  minimumStock: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  status: {
    type: String,
    enum: ['Healthy', 'Low Stock', 'Expired', 'Near Expiry'],
    default: 'Healthy',
  },
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;