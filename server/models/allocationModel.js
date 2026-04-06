const pool = require('../config/db');

const AllocationModel = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT a.*, s.name as student_name, s.student_id_number,
        r.room_number, r.type as room_type
      FROM allocations a
      LEFT JOIN students s ON a.student_id = s.student_id
      LEFT JOIN rooms r ON a.room_id = r.room_id
      ORDER BY a.check_in_date DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT a.*, s.name as student_name, r.room_number
      FROM allocations a
      LEFT JOIN students s ON a.student_id = s.student_id
      LEFT JOIN rooms r ON a.room_id = r.room_id
      WHERE a.allocation_id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ student_id, room_id, check_in_date, check_out_date }) {
    const [result] = await pool.query(
      'INSERT INTO allocations (student_id, room_id, check_in_date, check_out_date) VALUES (?, ?, ?, ?)',
      [student_id, room_id, check_in_date, check_out_date || null]
    );
    return { allocation_id: result.insertId, student_id, room_id, check_in_date, check_out_date };
  },

  async findByStudentId(studentId) {
    const [rows] = await pool.query(`
      SELECT a.*, r.room_number, r.type as room_type
      FROM allocations a
      LEFT JOIN rooms r ON a.room_id = r.room_id
      WHERE a.student_id = ?
      ORDER BY a.check_in_date DESC
    `, [studentId]);
    return rows;
  },

  async findByRoomId(roomId) {
    const [rows] = await pool.query(`
      SELECT a.*, s.name as student_name, s.student_id_number
      FROM allocations a
      LEFT JOIN students s ON a.student_id = s.student_id
      WHERE a.room_id = ?
      ORDER BY a.check_in_date DESC
    `, [roomId]);
    return rows;
  }
};

module.exports = AllocationModel;
