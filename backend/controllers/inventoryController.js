const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ managedBy: req.user._id });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new inventory item
// @route   POST /api/inventory
const addInventoryItem = async (req, res) => {
  const { itemName, category, quantity, unit } = req.body;
  try {
    const item = await Inventory.create({
      itemName,
      category,
      quantity,
      unit,
      managedBy: req.user._id,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stock quantity
// @route   PUT /api/inventory/:id
const updateStock = async (req, res) => {
  const { quantity } = req.body; // Pass the new quantity
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.managedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item.quantity = quantity;
    await item.save();
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInventory, addInventoryItem, updateStock };