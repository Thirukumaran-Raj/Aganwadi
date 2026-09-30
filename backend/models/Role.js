const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
