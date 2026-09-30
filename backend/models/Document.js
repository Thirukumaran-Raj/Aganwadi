const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  fileUrl: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Profile', 'ID Proof', 'Certificate', 'Report', 'Other'],
    default: 'Other',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  entityType: {
    type: String,
    default: 'General',
  },
  entityId: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
