const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ─── Import Routes ──────────────────────────────────────────
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const studentRoutes = require('./routes/students');
const paymentRoutes = require('./routes/payments');
const complaintRoutes = require('./routes/complaints');
const allocationRoutes = require('./routes/allocations');
const dashboardRoutes = require('./routes/dashboard');
const foodRoutes = require('./routes/foodRoutes');

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/food', foodRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartStay API is running' });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SmartStay API running on http://localhost:${PORT}`);
  console.log(`   Admin: admin@smartstay.com / admin123`);
  console.log(`   Student: alex@student.com / student123`);
});
