const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/signup (alias for register — backward compatibility)
router.post('/signup', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
