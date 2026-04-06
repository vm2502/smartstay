const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  // Connect without database first to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  console.log('🔗 Connected to MySQL');
  await connection.query('CREATE DATABASE IF NOT EXISTS smartstay');
  await connection.query('USE smartstay');
  console.log('📦 Database "smartstay" ready');

  // Drop tables in reverse dependency order
  await connection.query('DROP TABLE IF EXISTS allocations');
  await connection.query('DROP TABLE IF EXISTS complaints');
  await connection.query('DROP TABLE IF EXISTS payments');
  await connection.query('DROP TABLE IF EXISTS students');
  await connection.query('DROP TABLE IF EXISTS rooms');
  await connection.query('DROP TABLE IF EXISTS users');

  // Create Users table
  await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','student') DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Users table created');

  // Create Rooms table
  await connection.query(`
    CREATE TABLE rooms (
      room_id INT AUTO_INCREMENT PRIMARY KEY,
      room_number VARCHAR(20) UNIQUE NOT NULL,
      type ENUM('Standard','Premium','Suite') DEFAULT 'Standard',
      capacity INT DEFAULT 2,
      rent DECIMAL(10,2) DEFAULT 5000.00,
      status ENUM('available','occupied','maintenance') DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Rooms table created');

  // Create Students table
  await connection.query(`
    CREATE TABLE students (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      student_id_number VARCHAR(20) UNIQUE,
      contact VARCHAR(20),
      address TEXT,
      room_id INT,
      user_id INT,
      course VARCHAR(100),
      check_in_date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Students table created');

  // Create Allocations table
  await connection.query(`
    CREATE TABLE allocations (
      allocation_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      room_id INT,
      check_in_date DATE NOT NULL,
      check_out_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Allocations table created');

  // Create Payments table
  await connection.query(`
    CREATE TABLE payments (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('paid','pending','overdue') DEFAULT 'paid',
      date DATE DEFAULT (CURRENT_DATE),
      description VARCHAR(255) DEFAULT 'Monthly Rent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Payments table created');

  // Create Complaints table
  await connection.query(`
    CREATE TABLE complaints (
      complaint_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50) DEFAULT 'General',
      status ENUM('pending','in_progress','resolved') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Complaints table created');

  // ─── Seed Dummy Data ────────────────────────────────────────

  // Admin user
  const adminPass = await bcrypt.hash('admin123', 10);
  await connection.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ['Admin User', 'admin@smartstay.com', adminPass, 'admin']
  );

  // Student users
  const studentPass = await bcrypt.hash('student123', 10);
  const studentUsers = [
    ['Alex Smith', 'alex@student.com'],
    ['Maria Lopez', 'maria@student.com'],
    ['Julian Marshall', 'julian@student.com'],
    ['Elena Rodriguez', 'elena@student.com'],
    ['Marcus Chen', 'marcus@student.com'],
    ['Sarah Jenkins', 'sarah@student.com'],
    ['David Kim', 'david@student.com'],
    ['Amelia Thorne', 'amelia@student.com'],
  ];
  for (const [name, email] of studentUsers) {
    await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
      [name, email, studentPass]
    );
  }
  console.log('✅ Users seeded (1 admin + 8 students)');

  // Rooms
  const rooms = [
    ['A-101', 'Standard', 2, 450.00, 'occupied'],
    ['A-110', 'Standard', 2, 450.00, 'occupied'],
    ['B-102', 'Standard', 3, 380.00, 'occupied'],
    ['B-204', 'Premium', 2, 550.00, 'occupied'],
    ['C-301', 'Premium', 2, 550.00, 'occupied'],
    ['C-405', 'Suite', 1, 700.00, 'occupied'],
    ['D-112', 'Standard', 2, 450.00, 'occupied'],
    ['D-215', 'Premium', 2, 550.00, 'occupied'],
    ['E-100', 'Standard', 3, 380.00, 'available'],
    ['E-201', 'Suite', 1, 700.00, 'available'],
    ['F-301', 'Standard', 2, 450.00, 'available'],
    ['F-402', 'Premium', 2, 550.00, 'maintenance'],
  ];
  for (const [num, type, cap, rent, status] of rooms) {
    await connection.query(
      "INSERT INTO rooms (room_number, type, capacity, rent, status) VALUES (?, ?, ?, ?, ?)",
      [num, type, cap, rent, status]
    );
  }
  console.log('✅ Rooms seeded (12 rooms)');

  // Students (linked to user_ids 2-9, room_ids 1-8)
  const students = [
    ['Alex Smith', 'STU-88291', '+1 (555) 100-0001', 1, 2, 'Computer Science'],
    ['Maria Lopez', 'STU-44210', '+1 (555) 100-0002', 2, 3, 'Architecture'],
    ['Julian Marshall', 'STU-99102', '+1 (555) 100-0003', 4, 4, 'Design'],
    ['Elena Rodriguez', 'STU-55612', '+1 (555) 100-0004', 3, 5, 'Business'],
    ['Marcus Chen', 'STU-12833', '+1 (555) 100-0005', 5, 6, 'Engineering'],
    ['Sarah Jenkins', 'STU-33290', '+1 (555) 100-0006', 7, 7, 'Medicine'],
    ['David Kim', 'STU-10229', '+1 (555) 100-0007', 8, 8, 'Law'],
    ['Amelia Thorne', 'STU-10230', '+1 (555) 100-0008', 6, 9, 'Arts'],
  ];
  for (const [name, sid, contact, roomId, userId, course] of students) {
    await connection.query(
      "INSERT INTO students (name, student_id_number, contact, room_id, user_id, course) VALUES (?, ?, ?, ?, ?, ?)",
      [name, sid, contact, roomId, userId, course]
    );
  }
  console.log('✅ Students seeded (8 students)');

  // Allocations (match each student to their room)
  const allocations = [
    [1, 1, '2024-08-15', null],
    [2, 2, '2024-08-20', null],
    [3, 4, '2024-09-01', null],
    [4, 3, '2024-09-05', null],
    [5, 5, '2024-09-10', null],
    [6, 7, '2024-09-15', null],
    [7, 8, '2024-10-01', null],
    [8, 6, '2024-10-05', null],
  ];
  for (const [studentId, roomId, checkIn, checkOut] of allocations) {
    await connection.query(
      "INSERT INTO allocations (student_id, room_id, check_in_date, check_out_date) VALUES (?, ?, ?, ?)",
      [studentId, roomId, checkIn, checkOut]
    );
  }
  console.log('✅ Allocations seeded (8 records)');

  // Payments
  const payments = [
    [1, 450.00, 'paid', '2024-10-24', 'October Rent'],
    [2, 380.00, 'pending', '2024-10-23', 'October Rent'],
    [3, 550.00, 'paid', '2024-10-22', 'October Rent'],
    [4, 380.00, 'overdue', '2024-10-20', 'October Rent'],
    [5, 550.00, 'paid', '2024-10-24', 'October Rent'],
    [6, 450.00, 'paid', '2024-09-24', 'September Rent'],
    [7, 550.00, 'paid', '2024-09-24', 'September Rent'],
    [8, 700.00, 'overdue', '2024-10-20', 'October Rent'],
    [1, 450.00, 'paid', '2024-09-24', 'September Rent'],
    [2, 380.00, 'paid', '2024-09-23', 'September Rent'],
    [3, 550.00, 'paid', '2024-09-22', 'September Rent'],
    [5, 550.00, 'paid', '2024-08-24', 'August Rent'],
    [6, 450.00, 'paid', '2024-08-24', 'August Rent'],
  ];
  for (const [sid, amount, status, date, desc] of payments) {
    await connection.query(
      "INSERT INTO payments (student_id, amount, status, date, description) VALUES (?, ?, ?, ?, ?)",
      [sid, amount, status, date, desc]
    );
  }
  console.log('✅ Payments seeded (13 records)');

  // Complaints
  const complaints = [
    [1, 'Water leakage in bathroom', 'Significant dripping from the main faucet. Floor is becoming slippery.', 'Plumbing', 'pending'],
    [2, 'Socket malfunction', 'The wall socket near the desk is sparking when plugging in chargers.', 'Electrical', 'pending'],
    [5, 'Persistent Lag - West Wing', 'WiFi connectivity is extremely slow in the west wing common area and rooms.', 'WiFi', 'in_progress'],
    [6, 'Room turnover request', 'Requesting deep cleaning before new semester starts.', 'Cleaning', 'resolved'],
    [3, 'AC not working properly', 'Air conditioning unit making loud noise and not cooling effectively.', 'Maintenance', 'pending'],
    [4, 'WiFi Connectivity Issue', 'Cannot connect to WiFi in Room B-102 since yesterday morning.', 'WiFi', 'resolved'],
  ];
  for (const [sid, title, desc, cat, status] of complaints) {
    await connection.query(
      "INSERT INTO complaints (student_id, title, description, category, status) VALUES (?, ?, ?, ?, ?)",
      [sid, title, desc, cat, status]
    );
  }
  console.log('✅ Complaints seeded (6 records)');

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Admin login: admin@smartstay.com / admin123');
  console.log('   Student login: alex@student.com / student123');
  await connection.end();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
