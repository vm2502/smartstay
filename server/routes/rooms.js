const express = require('express');
const roomController = require('../controllers/roomController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms
router.get('/', verifyToken, roomController.getAll);

// GET /api/rooms/:id
router.get('/:id', verifyToken, roomController.getById);

// POST /api/rooms (Admin only)
router.post('/', verifyToken, requireRole('admin'), roomController.create);

// PUT /api/rooms/:id (Admin only)
router.put('/:id', verifyToken, requireRole('admin'), roomController.update);

// DELETE /api/rooms/:id (Admin only)
router.delete('/:id', verifyToken, requireRole('admin'), roomController.remove);

module.exports = router;
