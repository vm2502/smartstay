const bcrypt = require('bcryptjs');

// In-memory data store for demo mode (when MySQL is unavailable)
const adminPass = bcrypt.hashSync('admin123', 10);
const studentPass = bcrypt.hashSync('student123', 10);

const data = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@smartstay.com', password: adminPass, role: 'admin' },
    { id: 2, name: 'Alex Smith', email: 'alex@student.com', password: studentPass, role: 'student' },
    { id: 3, name: 'Maria Lopez', email: 'maria@student.com', password: studentPass, role: 'student' },
    { id: 4, name: 'Julian Marshall', email: 'julian@student.com', password: studentPass, role: 'student' },
    { id: 5, name: 'Elena Rodriguez', email: 'elena@student.com', password: studentPass, role: 'student' },
    { id: 6, name: 'Marcus Chen', email: 'marcus@student.com', password: studentPass, role: 'student' },
    { id: 7, name: 'Sarah Jenkins', email: 'sarah@student.com', password: studentPass, role: 'student' },
    { id: 8, name: 'David Kim', email: 'david@student.com', password: studentPass, role: 'student' },
    { id: 9, name: 'Amelia Thorne', email: 'amelia@student.com', password: studentPass, role: 'student' },
  ],
  rooms: [
    { room_id: 1, room_number: 'A-101', type: 'Standard', capacity: 2, rent: 450, status: 'occupied' },
    { room_id: 2, room_number: 'A-110', type: 'Standard', capacity: 2, rent: 450, status: 'occupied' },
    { room_id: 3, room_number: 'B-102', type: 'Standard', capacity: 3, rent: 380, status: 'occupied' },
    { room_id: 4, room_number: 'B-204', type: 'Premium', capacity: 2, rent: 550, status: 'occupied' },
    { room_id: 5, room_number: 'C-301', type: 'Premium', capacity: 2, rent: 550, status: 'occupied' },
    { room_id: 6, room_number: 'C-405', type: 'Suite', capacity: 1, rent: 700, status: 'occupied' },
    { room_id: 7, room_number: 'D-112', type: 'Standard', capacity: 2, rent: 450, status: 'occupied' },
    { room_id: 8, room_number: 'D-215', type: 'Premium', capacity: 2, rent: 550, status: 'occupied' },
    { room_id: 9, room_number: 'E-100', type: 'Standard', capacity: 3, rent: 380, status: 'available' },
    { room_id: 10, room_number: 'E-201', type: 'Suite', capacity: 1, rent: 700, status: 'available' },
    { room_id: 11, room_number: 'F-301', type: 'Standard', capacity: 2, rent: 450, status: 'available' },
    { room_id: 12, room_number: 'F-402', type: 'Premium', capacity: 2, rent: 550, status: 'maintenance' },
  ],
  students: [
    { student_id: 1, name: 'Alex Smith', student_id_number: 'STU-88291', contact: '+1 (555) 100-0001', room_id: 1, user_id: 2, course: 'Computer Science', check_in_date: '2024-08-15' },
    { student_id: 2, name: 'Maria Lopez', student_id_number: 'STU-44210', contact: '+1 (555) 100-0002', room_id: 2, user_id: 3, course: 'Architecture', check_in_date: '2024-08-20' },
    { student_id: 3, name: 'Julian Marshall', student_id_number: 'STU-99102', contact: '+1 (555) 100-0003', room_id: 4, user_id: 4, course: 'Design', check_in_date: '2024-09-01' },
    { student_id: 4, name: 'Elena Rodriguez', student_id_number: 'STU-55612', contact: '+1 (555) 100-0004', room_id: 3, user_id: 5, course: 'Business', check_in_date: '2024-09-05' },
    { student_id: 5, name: 'Marcus Chen', student_id_number: 'STU-12833', contact: '+1 (555) 100-0005', room_id: 5, user_id: 6, course: 'Engineering', check_in_date: '2024-09-10' },
    { student_id: 6, name: 'Sarah Jenkins', student_id_number: 'STU-33290', contact: '+1 (555) 100-0006', room_id: 7, user_id: 7, course: 'Medicine', check_in_date: '2024-09-15' },
    { student_id: 7, name: 'David Kim', student_id_number: 'STU-10229', contact: '+1 (555) 100-0007', room_id: 8, user_id: 8, course: 'Law', check_in_date: '2024-10-01' },
    { student_id: 8, name: 'Amelia Thorne', student_id_number: 'STU-10230', contact: '+1 (555) 100-0008', room_id: 6, user_id: 9, course: 'Arts', check_in_date: '2024-10-05' },
  ],
  payments: [
    { payment_id: 1, student_id: 1, amount: 450, status: 'paid', date: '2024-10-24', description: 'October Rent' },
    { payment_id: 2, student_id: 2, amount: 380, status: 'pending', date: '2024-10-23', description: 'October Rent' },
    { payment_id: 3, student_id: 3, amount: 550, status: 'paid', date: '2024-10-22', description: 'October Rent' },
    { payment_id: 4, student_id: 4, amount: 380, status: 'overdue', date: '2024-10-20', description: 'October Rent' },
    { payment_id: 5, student_id: 5, amount: 550, status: 'paid', date: '2024-10-24', description: 'October Rent' },
    { payment_id: 6, student_id: 6, amount: 450, status: 'paid', date: '2024-09-24', description: 'September Rent' },
    { payment_id: 7, student_id: 7, amount: 550, status: 'paid', date: '2024-09-24', description: 'September Rent' },
    { payment_id: 8, student_id: 8, amount: 700, status: 'overdue', date: '2024-10-20', description: 'October Rent' },
    { payment_id: 9, student_id: 1, amount: 450, status: 'paid', date: '2024-09-24', description: 'September Rent' },
    { payment_id: 10, student_id: 2, amount: 380, status: 'paid', date: '2024-09-23', description: 'September Rent' },
    { payment_id: 11, student_id: 3, amount: 550, status: 'paid', date: '2024-09-22', description: 'September Rent' },
    { payment_id: 12, student_id: 5, amount: 550, status: 'paid', date: '2024-08-24', description: 'August Rent' },
    { payment_id: 13, student_id: 6, amount: 450, status: 'paid', date: '2024-08-24', description: 'August Rent' },
  ],
  complaints: [
    { complaint_id: 1, student_id: 1, title: 'Water leakage in bathroom', description: 'Significant dripping from the main faucet. Floor is becoming slippery.', category: 'Plumbing', status: 'pending', created_at: '2024-10-24T10:45:00Z', updated_at: '2024-10-24T10:45:00Z' },
    { complaint_id: 2, student_id: 2, title: 'Socket malfunction', description: 'The wall socket near the desk is sparking when plugging in chargers.', category: 'Electrical', status: 'pending', created_at: '2024-10-23T14:20:00Z', updated_at: '2024-10-23T14:20:00Z' },
    { complaint_id: 3, student_id: 5, title: 'Persistent Lag - West Wing', description: 'WiFi connectivity is extremely slow in the west wing common area and rooms.', category: 'WiFi', status: 'in_progress', created_at: '2024-10-22T09:00:00Z', updated_at: '2024-10-23T11:00:00Z' },
    { complaint_id: 4, student_id: 6, title: 'Room turnover request', description: 'Requesting deep cleaning before new semester starts.', category: 'Cleaning', status: 'resolved', created_at: '2024-10-20T16:30:00Z', updated_at: '2024-10-22T14:00:00Z' },
    { complaint_id: 5, student_id: 3, title: 'AC not working properly', description: 'Air conditioning unit making loud noise and not cooling effectively.', category: 'Maintenance', status: 'pending', created_at: '2024-10-24T08:15:00Z', updated_at: '2024-10-24T08:15:00Z' },
    { complaint_id: 6, student_id: 4, title: 'WiFi Connectivity Issue', description: 'Cannot connect to WiFi in Room B-102 since yesterday morning.', category: 'WiFi', status: 'resolved', created_at: '2024-10-21T07:00:00Z', updated_at: '2024-10-22T16:30:00Z' },
  ],
  _nextIds: { users: 10, rooms: 13, students: 9, payments: 14, complaints: 7 }
};

module.exports = data;
