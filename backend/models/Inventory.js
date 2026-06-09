const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Medicine', 'Supplies'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String, // e.g., 'kg', 'liters', 'packets'
    required: true,
  },
  // Link the inventory to the specific worker/center
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;