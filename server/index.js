const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const data = require('./demoData');
const JWT_SECRET = process.env.JWT_SECRET || 'smartstay_jwt_secret_key_2024';

const app = express();
app.use(cors());
app.use(express.json());

// ─── Auth Middleware ────────────────────────────────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(403).json({ message: 'Invalid token.' }); }
}
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Insufficient permissions.' });
    next();
  };
}

// ─── Helper: enrich student with room info ──────────────────
function enrichStudent(s) {
  const room = data.rooms.find(r => r.room_id === s.room_id);
  return { ...s, room_number: room?.room_number || null, room_type: room?.type || null };
}
function enrichPayment(p) {
  const student = data.students.find(s => s.student_id === p.student_id);
  const room = student ? data.rooms.find(r => r.room_id === student.room_id) : null;
  return { ...p, student_name: student?.name || null, student_id_number: student?.student_id_number || null, room_number: room?.room_number || null };
}
function enrichComplaint(c) {
  const student = data.students.find(s => s.student_id === c.student_id);
  const room = student ? data.rooms.find(r => r.room_id === student.room_id) : null;
  return { ...c, student_name: student?.name || null, student_id_number: student?.student_id_number || null, room_number: room?.room_number || null };
}

// ═══════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (data.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered.' });
  const id = data._nextIds.users++;
  const hashed = bcrypt.hashSync(password, 10);
  const newUser = { id, name, email, password: hashed, role: role || 'student' };
  data.users.push(newUser);
  const token = jwt.sign({ id, email, role: newUser.role, name }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ token, user: { id, name, email, role: newUser.role } });
});

// ═══════════════════════════════════════════════════════════
//  ROOMS
// ═══════════════════════════════════════════════════════════
app.get('/api/rooms', verifyToken, (req, res) => {
  const rooms = data.rooms.map(r => ({
    ...r,
    current_occupants: data.students.filter(s => s.room_id === r.room_id).length
  }));
  res.json(rooms);
});

app.get('/api/rooms/:id', verifyToken, (req, res) => {
  const room = data.rooms.find(r => r.room_id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ ...room, current_occupants: data.students.filter(s => s.room_id === room.room_id).length });
});

app.post('/api/rooms', verifyToken, requireRole('admin'), (req, res) => {
  const { room_number, type, capacity, rent, status } = req.body;
  const id = data._nextIds.rooms++;
  const room = { room_id: id, room_number, type: type || 'Standard', capacity: capacity || 2, rent: rent || 5000, status: status || 'available' };
  data.rooms.push(room);
  res.status(201).json(room);
});

app.put('/api/rooms/:id', verifyToken, requireRole('admin'), (req, res) => {
  const room = data.rooms.find(r => r.room_id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  Object.assign(room, req.body);
  res.json({ message: 'Room updated successfully.' });
});

app.delete('/api/rooms/:id', verifyToken, requireRole('admin'), (req, res) => {
  const idx = data.rooms.findIndex(r => r.room_id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Room not found.' });
  data.rooms.splice(idx, 1);
  res.json({ message: 'Room deleted successfully.' });
});

// ═══════════════════════════════════════════════════════════
//  STUDENTS
// ═══════════════════════════════════════════════════════════
app.get('/api/students', verifyToken, (req, res) => {
  let result = data.students.map(enrichStudent);
  const { search, room_id } = req.query;
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || (s.student_id_number || '').toLowerCase().includes(q));
  }
  if (room_id) result = result.filter(s => s.room_id === parseInt(room_id));
  res.json(result);
});

app.get('/api/students/:id', verifyToken, (req, res) => {
  const s = data.students.find(s => s.student_id === parseInt(req.params.id));
  if (!s) return res.status(404).json({ message: 'Student not found.' });
  res.json(enrichStudent(s));
});

app.post('/api/students', verifyToken, requireRole('admin'), (req, res) => {
  const { name, student_id_number, contact, room_id, user_id, course } = req.body;
  const id = data._nextIds.students++;
  const student = { student_id: id, name, student_id_number, contact, room_id: room_id ? parseInt(room_id) : null, user_id: user_id || null, course: course || '' };
  data.students.push(student);
  res.status(201).json(student);
});

app.put('/api/students/:id', verifyToken, requireRole('admin'), (req, res) => {
  const s = data.students.find(s => s.student_id === parseInt(req.params.id));
  if (!s) return res.status(404).json({ message: 'Student not found.' });
  Object.assign(s, req.body);
  res.json({ message: 'Student updated successfully.' });
});

app.delete('/api/students/:id', verifyToken, requireRole('admin'), (req, res) => {
  const idx = data.students.findIndex(s => s.student_id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Student not found.' });
  data.students.splice(idx, 1);
  res.json({ message: 'Student deleted successfully.' });
});

// ═══════════════════════════════════════════════════════════
//  PAYMENTS
// ═══════════════════════════════════════════════════════════
app.get('/api/payments', verifyToken, (req, res) => {
  let result = data.payments.map(enrichPayment);
  const { status, student_id } = req.query;
  if (status) result = result.filter(p => p.status === status);
  if (student_id) result = result.filter(p => p.student_id === parseInt(student_id));
  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(result);
});

app.post('/api/payments', verifyToken, requireRole('admin'), (req, res) => {
  const { student_id, amount, status, date, description } = req.body;
  const id = data._nextIds.payments++;
  const payment = { payment_id: id, student_id: parseInt(student_id), amount: parseFloat(amount), status: status || 'paid', date: date || new Date().toISOString().split('T')[0], description: description || 'Monthly Rent' };
  data.payments.push(payment);
  res.status(201).json(payment);
});

app.put('/api/payments/:id', verifyToken, requireRole('admin'), (req, res) => {
  const p = data.payments.find(p => p.payment_id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ message: 'Payment not found.' });
  Object.assign(p, req.body);
  res.json({ message: 'Payment updated successfully.' });
});

// ═══════════════════════════════════════════════════════════
//  COMPLAINTS
// ═══════════════════════════════════════════════════════════
app.get('/api/complaints', verifyToken, (req, res) => {
  let result = data.complaints.map(enrichComplaint);
  const { status } = req.query;
  if (status) result = result.filter(c => c.status === status);
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(result);
});

app.post('/api/complaints', verifyToken, (req, res) => {
  const { student_id, title, description, category } = req.body;
  const id = data._nextIds.complaints++;
  const complaint = { complaint_id: id, student_id: parseInt(student_id), title, description, category: category || 'General', status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  data.complaints.push(complaint);
  res.status(201).json(complaint);
});

app.put('/api/complaints/:id', verifyToken, (req, res) => {
  const c = data.complaints.find(c => c.complaint_id === parseInt(req.params.id));
  if (!c) return res.status(404).json({ message: 'Complaint not found.' });
  if (req.body.status) c.status = req.body.status;
  if (req.body.title) c.title = req.body.title;
  if (req.body.description) c.description = req.body.description;
  if (req.body.category) c.category = req.body.category;
  c.updated_at = new Date().toISOString();
  res.json({ message: 'Complaint updated successfully.' });
});

app.delete('/api/complaints/:id', verifyToken, requireRole('admin'), (req, res) => {
  const idx = data.complaints.findIndex(c => c.complaint_id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Complaint not found.' });
  data.complaints.splice(idx, 1);
  res.json({ message: 'Complaint deleted successfully.' });
});

// ═══════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════
app.get('/api/dashboard/admin', verifyToken, (req, res) => {
  const totalRooms = data.rooms.length;
  const occupiedRooms = data.rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = data.rooms.filter(r => r.status === 'available').length;
  const totalStudents = data.students.length;
  const pendingPayments = data.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const pendingCount = data.payments.filter(p => p.status !== 'paid').length;
  const totalRevenue = data.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const activeComplaints = data.complaints.filter(c => c.status !== 'resolved').length;

  const recentStudents = data.students.slice(-5).reverse().map(enrichStudent);

  // Group payments by month
  const monthMap = {};
  data.payments.filter(p => p.status === 'paid').forEach(p => {
    const m = p.date.substring(0, 7);
    monthMap[m] = (monthMap[m] || 0) + p.amount;
  });
  const monthlyRevenue = Object.entries(monthMap).sort().slice(-6).map(([month, revenue]) => ({ month, revenue }));

  const recentPayments = data.payments.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(enrichPayment);

  res.json({ totalRooms, occupiedRooms, availableRooms, totalStudents, pendingPayments, pendingCount, totalRevenue, activeComplaints, recentStudents, monthlyRevenue, recentPayments });
});

app.get('/api/dashboard/student/:userId', verifyToken, (req, res) => {
  const userId = parseInt(req.params.userId);
  const student = data.students.find(s => s.user_id === userId);
  if (!student) return res.json({ student: null, payments: [], complaints: [], roommates: [] });

  const room = data.rooms.find(r => r.room_id === student.room_id);
  const enriched = { ...student, room_number: room?.room_number, room_type: room?.type, capacity: room?.capacity, rent: room?.rent };
  const payments = data.payments.filter(p => p.student_id === student.student_id).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  const complaints = data.complaints.filter(c => c.student_id === student.student_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
  const roommates = student.room_id ? data.students.filter(s => s.room_id === student.room_id && s.student_id !== student.student_id).map(s => ({ name: s.name, course: s.course })) : [];

  res.json({ student: enriched, payments, complaints, roommates });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'demo', message: 'SmartStay API running in demo mode (in-memory data)' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SmartStay API running on http://localhost:${PORT} (Demo Mode)`);
  console.log(`   Admin: admin@smartstay.com / admin123`);
  console.log(`   Student: alex@student.com / student123`);
});
