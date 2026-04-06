const pool = require('../config/db');

const ComplaintModel = {
  async findAll({ status } = {}) {
    let query = `
      SELECT c.*, s.name as student_name, s.student_id_number, r.room_number
      FROM complaints c
      LEFT JOIN students s ON c.student_id = s.student_id
      LEFT JOIN rooms r ON s.room_id = r.room_id
    `;
    const params = [];
    if (status) { query += ' WHERE c.status = ?'; params.push(status); }
    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async create({ student_id, title, description, category }) {
    const [result] = await pool.query(
      'INSERT INTO complaints (student_id, title, description, category, status) VALUES (?, ?, ?, ?, ?)',
      [student_id, title, description, category || 'General', 'pending']
    );
    return { complaint_id: result.insertId, title, status: 'pending' };
  },

  async update(id, { status, title, description, category }) {
    const updates = [];
    const params = [];
    if (status) { updates.push('status=?'); params.push(status); }
    if (title) { updates.push('title=?'); params.push(title); }
    if (description) { updates.push('description=?'); params.push(description); }
    if (category) { updates.push('category=?'); params.push(category); }
    if (updates.length === 0) return;
    params.push(id);
    await pool.query(`UPDATE complaints SET ${updates.join(', ')} WHERE complaint_id=?`, params);
  },

  async deleteById(id) {
    await pool.query('DELETE FROM complaints WHERE complaint_id = ?', [id]);
  }
};

module.exports = ComplaintModel;
