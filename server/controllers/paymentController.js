const PaymentModel = require('../models/paymentModel');

const paymentController = {
  // GET /api/payments
  async getAll(req, res) {
    try {
      const { status, student_id } = req.query;
      const payments = await PaymentModel.findAll({ status, student_id });
      res.json(payments);
    } catch (err) {
      console.error('Get payments error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/payments
  async create(req, res) {
    try {
      const payment = await PaymentModel.create(req.body);
      res.status(201).json(payment);
    } catch (err) {
      console.error('Create payment error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/payments/:id
  async update(req, res) {
    try {
      await PaymentModel.update(req.params.id, req.body);
      res.json({ message: 'Payment updated successfully.' });
    } catch (err) {
      console.error('Update payment error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
};

module.exports = paymentController;
