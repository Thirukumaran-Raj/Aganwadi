const Child = require('../models/Child');
const Beneficiary = require('../models/Beneficiary');
const AnganwadiCentre = require('../models/AnganwadiCentre');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Attendance = require('../models/Attendance');

const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalChildren,
      totalBeneficiaries,
      totalCentres,
      totalWorkers,
      lowStockItems,
      attendanceToday,
    ] = await Promise.all([
      Child.countDocuments(),
      Beneficiary.countDocuments(),
      AnganwadiCentre.countDocuments(),
      User.countDocuments({ role: { $in: ['worker', 'admin', 'supervisor'] } }),
      Inventory.countDocuments({ status: 'Low Stock' }),
      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),
    ]);

    const dashboardStats = {
      totalChildren,
      totalBeneficiaries,
      totalCentres,
      totalWorkers,
      lowStockItems,
      attendanceToday,
    };

    res.status(200).json({
      message: 'Dashboard overview loaded successfully',
      data: dashboardStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardOverview,
};
