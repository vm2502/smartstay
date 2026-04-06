const AllocationModel = require('../models/allocationModel');

const allocationController = {
  // GET /api/allocations
  async getAll(req, res) {
    try {
      const allocations = await AllocationModel.findAll();
      res.json(allocations);
    } catch (err) {
      console.error('Get allocations error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/allocations/:id
  async getById(req, res) {
    try {
      const allocation = await AllocationModel.findById(req.params.id);
      if (!allocation) return res.status(404).json({ message: 'Allocation not found.' });
      res.json(allocation);
    } catch (err) {
      console.error('Get allocation error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/allocations
  async create(req, res) {
    try {
      const allocation = await AllocationModel.create(req.body);
      res.status(201).json(allocation);
    } catch (err) {
      console.error('Create allocation error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/allocations/student/:studentId
  async getByStudent(req, res) {
    try {
      const allocations = await AllocationModel.findByStudentId(req.params.studentId);
      res.json(allocations);
    } catch (err) {
      console.error('Get student allocations error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/allocations/room/:roomId
  async getByRoom(req, res) {
    try {
      const allocations = await AllocationModel.findByRoomId(req.params.roomId);
      res.json(allocations);
    } catch (err) {
      console.error('Get room allocations error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = allocationController;
