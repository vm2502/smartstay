const express = require('express');
const { getMenu, addItem, deleteItem } = require('../controllers/foodController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/food
router.get('/', verifyToken, getMenu);

// POST /api/food
router.post('/', verifyToken, requireRole('admin'), addItem);

// DELETE /api/food/:id
router.delete('/:id', verifyToken, requireRole('admin'), deleteItem);

module.exports = router;
