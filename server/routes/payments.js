const express = require('express');
const paymentController = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments
router.get('/', verifyToken, paymentController.getAll);

// POST /api/payments (Admin only)
router.post('/', verifyToken, requireRole('admin'), paymentController.create);

// PUT /api/payments/:id (Admin only)
router.put('/:id', verifyToken, requireRole('admin'), paymentController.update);

module.exports = router;
