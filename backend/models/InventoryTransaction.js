const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true,
  },
  type: {
    type: String,
    enum: ['Received', 'Distributed', 'Damaged', 'Adjusted'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reference: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
module.exports = InventoryTransaction;
