const Attendance = require('../models/Attendance');
const Child = require('../models/Child');

// @desc    Save or update daily attendance
// @route   POST /api/attendance
const saveAttendance = async (req, res) => {
  const { date, records } = req.body;
  
  try {
    // Strip the time from the date so we only match the exact day
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    // Check if an attendance record already exists for today
    let attendance = await Attendance.findOne({ 
      date: queryDate, 
      managedBy: req.user._id 
    });

    if (attendance) {
      // If it exists, update it
      attendance.records = records;
      await attendance.save();
    } else {
      // If it doesn't exist, create a new one
      attendance = await Attendance.create({
        date: queryDate,
        managedBy: req.user._id,
        records
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance for a specific date
// @route   GET /api/attendance/:date
const getAttendanceByDate = async (req, res) => {
  try {
    const queryDate = new Date(req.params.date);
    queryDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ 
      date: queryDate, 
      managedBy: req.user._id 
    });

    res.status(200).json(attendance || { records: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveAttendance, getAttendanceByDate };