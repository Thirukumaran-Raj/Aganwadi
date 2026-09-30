const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnganwadiCentre',
    default: null,
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  scope: {
    type: String,
    enum: ['Children', 'Workers'],
    default: 'Children',
  },
  records: [{
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child'
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker'
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Holiday', 'Leave', 'On Duty'],
      default: 'Present',
    },
    present: {
      type: Boolean,
      default: false
    },
    mealProvided: {
      type: Boolean,
      default: false
    },
    remarks: {
      type: String,
      default: '',
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;