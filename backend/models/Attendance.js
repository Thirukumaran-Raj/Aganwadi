const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  // Link the attendance log to the specific worker who took it
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // An array holding the status of every child for that day
  records: [{
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Child'
    },
    present: {
      type: Boolean,
      default: false
    },
    mealProvided: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;