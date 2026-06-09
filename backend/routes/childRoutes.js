const express = require('express');
const router = express.Router();
const { 
  registerChild, 
  getChildren, 
  getChildById, 
  addHealthLog 
} = require('../controllers/childController');
const { protect } = require('../middlewares/authMiddleware');

// Standard routes
router.route('/').post(protect, registerChild).get(protect, getChildren);

// Routes for a specific child by their ID
router.route('/:id').get(protect, getChildById);
router.route('/:id/health').post(protect, addHealthLog);

module.exports = router;