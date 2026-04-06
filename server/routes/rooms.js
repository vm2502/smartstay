const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms - Get all rooms
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM students s WHERE s.room_id = r.room_id) as current_occupants
      FROM rooms r ORDER BY r.room_id DESC
    `);
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/rooms/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM students s WHERE s.room_id = r.room_id) as current_occupants
      FROM rooms r WHERE r.room_id = ?
    `, [req.params.id]);
    if (rooms.length === 0) return res.status(404).json({ message: 'Room not found.' });
    res.json(rooms[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/rooms - Add room (Admin)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { room_number, type, capacity, rent, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO rooms (room_number, type, capacity, rent, status) VALUES (?, ?, ?, ?, ?)',
      [room_number, type || 'Standard', capacity || 2, rent || 5000, status || 'available']
    );
    res.status(201).json({ room_id: result.insertId, room_number, type, capacity, rent, status: status || 'available' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/rooms/:id - Update room (Admin)
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { room_number, type, capacity, rent, status } = req.body;
    await pool.query(
      'UPDATE rooms SET room_number=?, type=?, capacity=?, rent=?, status=? WHERE room_id=?',
      [room_number, type, capacity, rent, status, req.params.id]
    );
    res.json({ message: 'Room updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/rooms/:id - Delete room (Admin)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM rooms WHERE room_id = ?', [req.params.id]);
    res.json({ message: 'Room deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
