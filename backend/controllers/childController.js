const Child = require('../models/Child');

// @desc    Register a new child
// @route   POST /api/children
const registerChild = async (req, res) => {
  const { name, dateOfBirth, gender, parentName } = req.body;
  try {
    const child = await Child.create({
      name, dateOfBirth, gender, parentName,
      registeredBy: req.user._id, 
    });
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all children registered by the user
// @route   GET /api/children
const getChildren = async (req, res) => {
  try {
    const children = await Child.find({ registeredBy: req.user._id });
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: @desc    Get single child profile
// NEW: @route   GET /api/children/:id
const getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ message: 'Child not found' });
    
    // Security check: Make sure this worker owns this record
    if (child.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this record' });
    }
    
    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: @desc    Add a health log to a child
// NEW: @route   POST /api/children/:id/health
const addHealthLog = async (req, res) => {
  const { weight, height, notes } = req.body;
  try {
    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    // Add the new log to the beginning of the array
    const newLog = { weight, height, notes, date: Date.now() };
    child.healthLogs.unshift(newLog); 
    
    await child.save();
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerChild, getChildren, getChildById, addHealthLog };