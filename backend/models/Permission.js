const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    trim: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  scope: {
    type: String,
    default: 'all',
  },
}, {
  timestamps: true,
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
