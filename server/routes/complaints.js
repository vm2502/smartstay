const express = require('express');
const complaintController = require('../controllers/complaintController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/complaints
router.get('/', verifyToken, complaintController.getAll);

// POST /api/complaints (any authenticated user)
router.post('/', verifyToken, complaintController.create);

// PUT /api/complaints/:id (update status)
router.put('/:id', verifyToken, complaintController.update);

// DELETE /api/complaints/:id (Admin only)
router.delete('/:id', verifyToken, requireRole('admin'), complaintController.remove);

module.exports = router;
