-- Crear base de datos
CREATE DATABASE IF NOT EXISTS allcourts_db;
USE allcourts_db;

-- =========================
-- Tabla USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('player', 'manager') NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    token_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- =========================
-- Tabla MANAGERS
-- =========================
CREATE TABLE IF NOT EXISTS managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscription_active BOOLEAN DEFAULT FALSE,
    subscription_start DATE,
    subscription_end DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- Tabla COURTS
-- =========================
CREATE TABLE IF NOT EXISTS courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    price_hour DECIMAL(6,2) NOT NULL,
    surface_type ENUM('tierra', 'cesped', 'dura'),
    image_url VARCHAR(255),
    opening_time TIME,
    closing_time TIME,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE CASCADE
);

-- =========================
-- Tabla BOOKINGS
-- =========================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    court_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(6,2),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    cancel_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (court_id, date, start_time, end_time),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- =========================
-- Tabla PAYMENTS
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(6,2) NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
    method VARCHAR(30),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
