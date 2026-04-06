const express = require('express');
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/students
router.get('/', verifyToken, studentController.getAll);

// GET /api/students/:id
router.get('/:id', verifyToken, studentController.getById);

// POST /api/students (Admin only)
router.post('/', verifyToken, requireRole('admin'), studentController.create);

// PUT /api/students/:id (Admin only)
router.put('/:id', verifyToken, requireRole('admin'), studentController.update);

// DELETE /api/students/:id (Admin only)
router.delete('/:id', verifyToken, requireRole('admin'), studentController.remove);

module.exports = router;
