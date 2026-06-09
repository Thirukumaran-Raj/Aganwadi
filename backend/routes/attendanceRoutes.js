const express = require('express');
const router = express.Router();
const { saveAttendance, getAttendanceByDate } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, saveAttendance);

router.route('/:date')
  .get(protect, getAttendanceByDate);

module.exports = router;