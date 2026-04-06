-- ============================================================
-- SmartStay Database Schema
-- Hostel/PG Management System
-- ============================================================

CREATE DATABASE IF NOT EXISTS smartstay;
USE smartstay;

-- ─── Users Table ─────────────────────────────────────────────
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Rooms Table ─────────────────────────────────────────────
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(20) UNIQUE NOT NULL,
  type ENUM('Single', 'Double', 'Triple', 'Standard', 'Premium', 'Suite') DEFAULT 'Standard',
  capacity INT DEFAULT 2,
  rent DECIMAL(10, 2) DEFAULT 5000.00,
  status ENUM('Available', 'Occupied', 'available', 'occupied', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Students Table ──────────────────────────────────────────
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

-- ─── Allocations Table ───────────────────────────────────────
CREATE TABLE allocations (
  allocation_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  room_id INT,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- ─── Payments Table ──────────────────────────────────────────
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Paid', 'Pending', 'paid', 'pending', 'overdue') DEFAULT 'paid',
  date DATE DEFAULT (CURRENT_DATE),
  description VARCHAR(255) DEFAULT 'Monthly Rent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ─── Complaints Table ────────────────────────────────────────
CREATE TABLE complaints (
  complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'General',
  status ENUM('Pending', 'In Progress', 'Resolved', 'pending', 'in_progress', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
