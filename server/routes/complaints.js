const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/complaints
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT c.*, s.name as student_name, s.student_id_number, r.room_number
      FROM complaints c
      LEFT JOIN students s ON c.student_id = s.student_id
      LEFT JOIN rooms r ON s.room_id = r.room_id
    `;
    const params = [];
    if (status) { query += ' WHERE c.status = ?'; params.push(status); }
    query += ' ORDER BY c.created_at DESC';

    const [complaints] = await pool.query(query, params);
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/complaints - Raise complaint (Student or Admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { student_id, title, description, category } = req.body;
    const [result] = await pool.query(
      'INSERT INTO complaints (student_id, title, description, category, status) VALUES (?, ?, ?, ?, ?)',
      [student_id, title, description, category || 'General', 'pending']
    );
    res.status(201).json({ complaint_id: result.insertId, title, status: 'pending' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/complaints/:id - Update complaint status (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, title, description, category } = req.body;
    const updates = [];
    const params = [];
    if (status) { updates.push('status=?'); params.push(status); }
    if (title) { updates.push('title=?'); params.push(title); }
    if (description) { updates.push('description=?'); params.push(description); }
    if (category) { updates.push('category=?'); params.push(category); }
    params.push(req.params.id);

    await pool.query(`UPDATE complaints SET ${updates.join(', ')} WHERE complaint_id=?`, params);
    res.json({ message: 'Complaint updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/complaints/:id
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM complaints WHERE complaint_id = ?', [req.params.id]);
    res.json({ message: 'Complaint deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
