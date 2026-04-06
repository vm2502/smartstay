const pool = require('../config/db');

const StudentModel = {
  async findAll({ search, room_id } = {}) {
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

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT s.*, r.room_number, r.type as room_type,
        u.email, u.name as user_name
      FROM students s
      LEFT JOIN rooms r ON s.room_id = r.room_id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.student_id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ name, student_id_number, contact, room_id, user_id, course }) {
    const [result] = await pool.query(
      'INSERT INTO students (name, student_id_number, contact, room_id, user_id, course) VALUES (?, ?, ?, ?, ?, ?)',
      [name, student_id_number, contact, room_id || null, user_id || null, course || '']
    );
    return { student_id: result.insertId, name, student_id_number, contact, room_id, course };
  },

  async update(id, { name, student_id_number, contact, room_id, course }) {
    await pool.query(
      'UPDATE students SET name=?, student_id_number=?, contact=?, room_id=?, course=? WHERE student_id=?',
      [name, student_id_number, contact, room_id, course, id]
    );
  },

  async deleteById(id) {
    await pool.query('DELETE FROM students WHERE student_id = ?', [id]);
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT s.*, r.room_number, r.type as room_type, r.capacity, r.rent
      FROM students s
      LEFT JOIN rooms r ON s.room_id = r.room_id
      WHERE s.user_id = ?
    `, [userId]);
    return rows[0] || null;
  },

  async findRoommates(roomId, excludeStudentId) {
    const [rows] = await pool.query(
      'SELECT name, course FROM students WHERE room_id = ? AND student_id != ?',
      [roomId, excludeStudentId]
    );
    return rows;
  }
};

module.exports = StudentModel;
