const StudentModel = require('../models/studentModel');

const studentController = {
  // GET /api/students
  async getAll(req, res) {
    try {
      const { search, room_id } = req.query;
      const students = await StudentModel.findAll({ search, room_id });
      res.json(students);
    } catch (err) {
      console.error('Get students error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/students/:id
  async getById(req, res) {
    try {
      const student = await StudentModel.findById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found.' });
      res.json(student);
    } catch (err) {
      console.error('Get student error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/students
  async create(req, res) {
    try {
      const student = await StudentModel.create(req.body);
      res.status(201).json(student);
    } catch (err) {
      console.error('Create student error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/students/:id
  async update(req, res) {
    try {
      await StudentModel.update(req.params.id, req.body);
      res.json({ message: 'Student updated successfully.' });
    } catch (err) {
      console.error('Update student error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/students/:id
  async remove(req, res) {
    try {
      await StudentModel.deleteById(req.params.id);
      res.json({ message: 'Student deleted successfully.' });
    } catch (err) {
      console.error('Delete student error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = studentController;
