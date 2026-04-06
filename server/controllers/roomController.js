const RoomModel = require('../models/roomModel');

const roomController = {
  // GET /api/rooms
  async getAll(req, res) {
    try {
      const rooms = await RoomModel.findAll();
      res.json(rooms);
    } catch (err) {
      console.error('Get rooms error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/rooms/:id
  async getById(req, res) {
    try {
      const room = await RoomModel.findById(req.params.id);
      if (!room) return res.status(404).json({ message: 'Room not found.' });
      res.json(room);
    } catch (err) {
      console.error('Get room error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/rooms
  async create(req, res) {
    try {
      const room = await RoomModel.create(req.body);
      res.status(201).json(room);
    } catch (err) {
      console.error('Create room error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/rooms/:id
  async update(req, res) {
    try {
      await RoomModel.update(req.params.id, req.body);
      res.json({ message: 'Room updated successfully.' });
    } catch (err) {
      console.error('Update room error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/rooms/:id
  async remove(req, res) {
    try {
      await RoomModel.deleteById(req.params.id);
      res.json({ message: 'Room deleted successfully.' });
    } catch (err) {
      console.error('Delete room error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = roomController;
