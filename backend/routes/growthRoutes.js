const express = require('express');
const router = express.Router();
const {
  getGrowthRecords,
  createGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
} = require('../controllers/growthController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getGrowthRecords)
  .post(protect, createGrowthRecord);

router.route('/:id')
  .put(protect, updateGrowthRecord)
  .delete(protect, deleteGrowthRecord);

module.exports = router;
