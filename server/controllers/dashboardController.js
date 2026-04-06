const pool = require('../config/db');
const StudentModel = require('../models/studentModel');

const dashboardController = {
  // GET /api/dashboard/admin
  async adminDashboard(req, res) {
    try {
      const [[{ totalRooms }]] = await pool.query('SELECT COUNT(*) as totalRooms FROM rooms');
      const [[{ occupiedRooms }]] = await pool.query("SELECT COUNT(*) as occupiedRooms FROM rooms WHERE status = 'occupied'");
      const [[{ availableRooms }]] = await pool.query("SELECT COUNT(*) as availableRooms FROM rooms WHERE status = 'available'");
      const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students');
      const [[{ pendingPayments }]] = await pool.query("SELECT COALESCE(SUM(amount),0) as pendingPayments FROM payments WHERE status = 'pending'");
      const [[{ pendingCount }]] = await pool.query("SELECT COUNT(*) as pendingCount FROM payments WHERE status = 'pending'");
      const [[{ totalRevenue }]] = await pool.query("SELECT COALESCE(SUM(amount),0) as totalRevenue FROM payments WHERE status = 'paid'");
      const [[{ activeComplaints }]] = await pool.query("SELECT COUNT(*) as activeComplaints FROM complaints WHERE status != 'resolved'");

      const [recentStudents] = await pool.query(`
        SELECT s.*, r.room_number FROM students s
        LEFT JOIN rooms r ON s.room_id = r.room_id
        ORDER BY s.student_id DESC LIMIT 5
      `);

      const [monthlyRevenue] = await pool.query(`
        SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as revenue
        FROM payments WHERE status = 'paid'
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY month DESC LIMIT 6
      `);

      const [recentPayments] = await pool.query(`
        SELECT p.*, s.name as student_name, r.room_number
        FROM payments p
        LEFT JOIN students s ON p.student_id = s.student_id
        LEFT JOIN rooms r ON s.room_id = r.room_id
        ORDER BY p.date DESC LIMIT 5
      `);

      res.json({
        totalRooms, occupiedRooms, availableRooms, totalStudents,
        pendingPayments, pendingCount, totalRevenue, activeComplaints,
        recentStudents, monthlyRevenue: monthlyRevenue.reverse(), recentPayments
      });
    } catch (err) {
      console.error('Admin dashboard error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/dashboard/student/:userId
  async studentDashboard(req, res) {
    try {
      const student = await StudentModel.findByUserId(req.params.userId);

      if (!student) {
        return res.json({ student: null, payments: [], complaints: [], roommates: [] });
      }

      const [payments] = await pool.query(
        'SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC LIMIT 10',
        [student.student_id]
      );

      const [complaints] = await pool.query(
        'SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC LIMIT 10',
        [student.student_id]
      );

      const roommates = student.room_id
        ? await StudentModel.findRoommates(student.room_id, student.student_id)
        : [];

      res.json({ student, payments, complaints, roommates });
    } catch (err) {
      console.error('Student dashboard error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = dashboardController;
