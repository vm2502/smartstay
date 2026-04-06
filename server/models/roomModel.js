const pool = require('../config/db');

const RoomModel = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM students s WHERE s.room_id = r.room_id) as current_occupants
      FROM rooms r ORDER BY r.room_id DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM students s WHERE s.room_id = r.room_id) as current_occupants
      FROM rooms r WHERE r.room_id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ room_number, type, capacity, rent, status }) {
    const [result] = await pool.query(
      'INSERT INTO rooms (room_number, type, capacity, rent, status) VALUES (?, ?, ?, ?, ?)',
      [room_number, type || 'Standard', capacity || 2, rent || 5000, status || 'available']
    );
    return { room_id: result.insertId, room_number, type, capacity, rent, status: status || 'available' };
  },

  async update(id, { room_number, type, capacity, rent, status }) {
    await pool.query(
      'UPDATE rooms SET room_number=?, type=?, capacity=?, rent=?, status=? WHERE room_id=?',
      [room_number, type, capacity, rent, status, id]
    );
  },

  async deleteById(id) {
    await pool.query('DELETE FROM rooms WHERE room_id = ?', [id]);
  }
};

module.exports = RoomModel;
