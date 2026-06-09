const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, updateStock } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getInventory)
  .post(protect, addInventoryItem);

router.route('/:id')
  .put(protect, updateStock);

module.exports = router;