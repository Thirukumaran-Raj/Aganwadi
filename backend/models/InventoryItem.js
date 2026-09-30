const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Nutrition', 'Educational Material', 'First Aid', 'Cleaning', 'Equipment', 'Furniture'],
    default: 'Food',
  },
  unit: {
    type: String,
    required: true,
    trim: true,
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
  closingStock: {
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

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
module.exports = InventoryItem;
