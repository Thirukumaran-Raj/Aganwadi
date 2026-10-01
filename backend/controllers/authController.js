const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

const isDatabaseUnavailable = (error) => mongoose.connection.readyState !== 1
  || error.name === 'MongoServerSelectionError'
  || error.message?.includes('buffering timed out');

const respondToAuthFailure = (res, error) => {
  console.error('Authentication request failed:', error.message);
  const unavailable = isDatabaseUnavailable(error);
  return res.status(unavailable ? 503 : 500).json({
    message: unavailable
      ? 'Sign-in is temporarily unavailable because the database is not connected. Please try again shortly.'
      : 'Unable to process the authentication request right now.',
  });
};

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30 days', // Token stays valid for 30 days
  });
};

// @desc    Register a new user (Worker/Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({ message: 'A valid name and email are required' });
  }
  if (typeof password !== 'string' || password.length < 12) {
    return res.status(400).json({ message: 'Password must be at least 12 characters' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (the password gets hashed automatically via our model middleware)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'worker',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    return respondToAuthFailure(res, error);
  }
};

const bootstrapAdmin = async (req, res) => {
  const configuredKey = process.env.ADMIN_BOOTSTRAP_KEY;
  const suppliedKey = req.get('x-admin-bootstrap-key') || '';

  if (!configuredKey || configuredKey.length < 32) {
    return res.status(503).json({ message: 'Administrator bootstrap is not configured' });
  }

  const configuredBuffer = Buffer.from(configuredKey);
  const suppliedBuffer = Buffer.from(suppliedKey);
  if (configuredBuffer.length !== suppliedBuffer.length || !crypto.timingSafeEqual(configuredBuffer, suppliedBuffer)) {
    return res.status(401).json({ message: 'Invalid bootstrap key' });
  }

  const { name, email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (typeof name !== 'string' || !name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'A valid name and email are required' });
  }
  if (typeof password !== 'string' || password.length < 12) {
    return res.status(400).json({ message: 'Password must be at least 12 characters' });
  }

  try {
    if (await User.exists({ role: 'admin' })) {
      return res.status(409).json({ message: 'An administrator already exists; bootstrap is closed' });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password, role: 'admin' });
    await AuditLog.create({
      user: user._id,
      action: 'admin.bootstrap',
      entity: 'User',
      entityId: String(user._id),
      details: { role: 'admin' },
      ipAddress: req.ip,
    });

    return res.status(201).json({ message: 'Administrator created successfully' });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'An account with this email already exists' : error.message,
    });
  }
};
// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && user.status === 'Active' && (await user.matchPassword(password))) {
      user.lastLoginAt = new Date();
      await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        centerId: user.centerId,
        assignedCentre: user.assignedCentre,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return respondToAuthFailure(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  bootstrapAdmin,
};