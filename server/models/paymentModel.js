const pool = require('../config/db');

const PaymentModel = {
  async findAll({ status, student_id } = {}) {
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

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async create({ student_id, amount, status, date, description }) {
    const [result] = await pool.query(
      'INSERT INTO payments (student_id, amount, status, date, description) VALUES (?, ?, ?, ?, ?)',
      [student_id, amount, status || 'paid', date || new Date().toISOString().split('T')[0], description || 'Monthly Rent']
    );
    return { payment_id: result.insertId, student_id, amount, status: status || 'paid' };
  },

  async update(id, { amount, status, description }) {
    await pool.query(
      'UPDATE payments SET amount=?, status=?, description=? WHERE payment_id=?',
      [amount, status, description, id]
    );
  }
};

module.exports = PaymentModel;
