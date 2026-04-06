const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/admin
router.get('/admin', verifyToken, dashboardController.adminDashboard);

// GET /api/dashboard/student/:userId
router.get('/student/:userId', verifyToken, dashboardController.studentDashboard);

module.exports = router;
