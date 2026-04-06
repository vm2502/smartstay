const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/students
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, room_id } = req.query;
    let query = `
      SELECT s.*, r.room_number, r.type as room_type,
        u.email, u.name as user_name
      FROM students s
      LEFT JOIN rooms r ON s.room_id = r.room_id
      LEFT JOIN users u ON s.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(s.name LIKE ? OR s.student_id_number LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (room_id) {
      conditions.push('s.room_id = ?');
      params.push(room_id);
    }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY s.student_id DESC';

    const [students] = await pool.query(query, params);
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/students/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [students] = await pool.query(`
      SELECT s.*, r.room_number, r.type as room_type,
        u.email, u.name as user_name
      FROM students s
      LEFT JOIN rooms r ON s.room_id = r.room_id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.student_id = ?
    `, [req.params.id]);
    if (students.length === 0) return res.status(404).json({ message: 'Student not found.' });
    res.json(students[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/students - Add student (Admin)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, student_id_number, contact, room_id, user_id, course } = req.body;
    const [result] = await pool.query(
      'INSERT INTO students (name, student_id_number, contact, room_id, user_id, course) VALUES (?, ?, ?, ?, ?, ?)',
      [name, student_id_number, contact, room_id || null, user_id || null, course || '']
    );
    res.status(201).json({ student_id: result.insertId, name, student_id_number, contact, room_id, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/students/:id
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, student_id_number, contact, room_id, course } = req.body;
    await pool.query(
      'UPDATE students SET name=?, student_id_number=?, contact=?, room_id=?, course=? WHERE student_id=?',
      [name, student_id_number, contact, room_id, course, req.params.id]
    );
    res.json({ message: 'Student updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
