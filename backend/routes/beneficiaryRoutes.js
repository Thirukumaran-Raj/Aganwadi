const express = require('express');
const router = express.Router();
const {
  getBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
} = require('../controllers/beneficiaryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getBeneficiaries)
  .post(protect, authorize('admin', 'supervisor', 'worker'), createBeneficiary);

router.route('/:id')
  .get(protect, getBeneficiaryById)
  .put(protect, authorize('admin', 'supervisor'), updateBeneficiary);

module.exports = router;
