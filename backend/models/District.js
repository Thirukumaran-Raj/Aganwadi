const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
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

const District = mongoose.model('District', districtSchema);
module.exports = District;
