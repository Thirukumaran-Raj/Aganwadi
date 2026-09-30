const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  entity: {
    type: String,
    required: true,
    trim: true,
  },
  entityId: {
    type: String,
    default: '',
  },
  details: {
    type: Object,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
