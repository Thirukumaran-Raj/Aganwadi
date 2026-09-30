const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header starting with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database (minus their password) and attach them to the request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
      }
      if (req.user.status !== 'Active') {
        return res.status(401).json({ message: 'This account is not active' });
      }

      next(); // Move on to the next piece of logic (the controller)
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(String(req.user.role).toLowerCase())) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }

  next();
};

module.exports = { protect, authorize };