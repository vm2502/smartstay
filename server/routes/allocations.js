const express = require('express');
const allocationController = require('../controllers/allocationController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/allocations
router.get('/', verifyToken, allocationController.getAll);

// GET /api/allocations/:id
router.get('/:id', verifyToken, allocationController.getById);

// POST /api/allocations (Admin only)
router.post('/', verifyToken, requireRole('admin'), allocationController.create);

// GET /api/allocations/student/:studentId
router.get('/student/:studentId', verifyToken, allocationController.getByStudent);

// GET /api/allocations/room/:roomId
router.get('/room/:roomId', verifyToken, allocationController.getByRoom);

module.exports = router;
