const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
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

const Sector = mongoose.model('Sector', sectorSchema);
module.exports = Sector;
