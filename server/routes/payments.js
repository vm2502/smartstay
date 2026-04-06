const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, student_id } = req.query;
    let query = `
      SELECT p.*, s.name as student_name, s.student_id_number, r.room_number
      FROM payments p
      LEFT JOIN students s ON p.student_id = s.student_id
      LEFT JOIN rooms r ON s.room_id = r.room_id
    `;
    const params = [];
    const conditions = [];

    if (status) { conditions.push('p.status = ?'); params.push(status); }
    if (student_id) { conditions.push('p.student_id = ?'); params.push(student_id); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY p.date DESC';

    const [payments] = await pool.query(query, params);
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/payments - Record payment (Admin)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { student_id, amount, status, date, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO payments (student_id, amount, status, date, description) VALUES (?, ?, ?, ?, ?)',
      [student_id, amount, status || 'paid', date || new Date().toISOString().split('T')[0], description || 'Monthly Rent']
    );
    res.status(201).json({ payment_id: result.insertId, student_id, amount, status: status || 'paid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/payments/:id - Update payment status
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { amount, status, description } = req.body;
    await pool.query(
      'UPDATE payments SET amount=?, status=?, description=? WHERE payment_id=?',
      [amount, status, description, req.params.id]
    );
    res.json({ message: 'Payment updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
