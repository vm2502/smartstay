const ComplaintModel = require('../models/complaintModel');

const complaintController = {
  // GET /api/complaints
  async getAll(req, res) {
    try {
      const { status } = req.query;
      const complaints = await ComplaintModel.findAll({ status });
      res.json(complaints);
    } catch (err) {
      console.error('Get complaints error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/complaints
  async create(req, res) {
    try {
      const complaint = await ComplaintModel.create(req.body);
      res.status(201).json(complaint);
    } catch (err) {
      console.error('Create complaint error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/complaints/:id
  async update(req, res) {
    try {
      await ComplaintModel.update(req.params.id, req.body);
      res.json({ message: 'Complaint updated successfully.' });
    } catch (err) {
      console.error('Update complaint error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/complaints/:id
  async remove(req, res) {
    try {
      await ComplaintModel.deleteById(req.params.id);
      res.json({ message: 'Complaint deleted successfully.' });
    } catch (err) {
      console.error('Delete complaint error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = complaintController;
