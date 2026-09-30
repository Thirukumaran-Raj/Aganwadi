const express = require('express');
const router = express.Router();
const { registerUser, loginUser, bootstrapAdmin } = require('../controllers/authController');

// Map the endpoints to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/bootstrap-admin', bootstrapAdmin);

module.exports = router;