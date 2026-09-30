const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  code: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;
