const express = require('express');
const router = express.Router();
const {
  getCentres,
  getCentreById,
  createCentre,
  updateCentre,
} = require('../controllers/centreController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getCentres)
  .post(protect, authorize('admin', 'supervisor'), createCentre);

router.route('/:id')
  .get(protect, getCentreById)
  .put(protect, authorize('admin', 'supervisor'), updateCentre);

module.exports = router;
