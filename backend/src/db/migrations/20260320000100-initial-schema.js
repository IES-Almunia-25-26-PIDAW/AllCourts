"use strict";

function runStatements(db, statements, callback) {
  let index = 0;

  function next(err) {
    if (err) {
      callback(err);
      return;
    }

    if (index >= statements.length) {
      callback();
      return;
    }

    const sql = statements[index];
    index += 1;

    db.runSql(sql, next);
  }

  next();
}

exports.up = function (db, callback) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
            id CHAR(36) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM ('player', 'manager') NOT NULL,
            phone VARCHAR(20),
            avatar_url VARCHAR(255),
            is_verified BOOLEAN DEFAULT FALSE,
            verification_token VARCHAR(255),
            token_expires_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL
        )`,
    `CREATE TABLE IF NOT EXISTS managers (
          id CHAR(36) PRIMARY KEY,
            subscription_active BOOLEAN DEFAULT FALSE,
            subscription_start DATE,
            subscription_end DATE,
            CONSTRAINT fk_managers_user FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS clubs (
            id INT AUTO_INCREMENT PRIMARY KEY,
          manager_id CHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            address VARCHAR(255),
            city VARCHAR(100),
            logo_url VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_clubs_manager FOREIGN KEY (manager_id) REFERENCES managers (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS courts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            club_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            surface_type ENUM (
                'tierra_batida',
                'cesped_natural',
                'cesped_artificial',
                'dura',
                'arena',
                'parque'
            ) NOT NULL,
            sport ENUM (
                'tenis',
                'padel',
                'pickleball',
                'baloncesto_3x3',
                'baloncesto_5x5',
                'futbol_5',
                'futbol_7',
                'futbol_11',
                'voley',
                'balonmano'
            ) NOT NULL,
            price_60 DECIMAL(6, 2) NOT NULL,
            price_90 DECIMAL(6, 2) NOT NULL,
            price_120 DECIMAL(6, 2) NOT NULL,
            min_unit_min INT DEFAULT 30,
            image_url VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_courts_club FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS court_schedules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            court_id INT NOT NULL,
            day_of_week TINYINT NOT NULL COMMENT '0=Dom, 1=Lun, ..., 6=Sab',
            opening_time TIME NOT NULL,
            closing_time TIME NOT NULL,
            is_closed BOOLEAN DEFAULT FALSE,
            CONSTRAINT uq_court_day UNIQUE (court_id, day_of_week),
            CONSTRAINT fk_schedules_court FOREIGN KEY (court_id) REFERENCES courts (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id CHAR(36) NOT NULL,
            court_id INT NOT NULL,
            date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            duration_min INT NOT NULL,
            total_price DECIMAL(6, 2) NOT NULL,
            status ENUM ('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
            cancel_reason VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_overlap (court_id, date, start_time, end_time),
            CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            CONSTRAINT fk_bookings_court FOREIGN KEY (court_id) REFERENCES courts (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            booking_id INT NOT NULL UNIQUE,
            amount DECIMAL(6, 2) NOT NULL,
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM ('success', 'failed', 'pending') DEFAULT 'pending',
            method VARCHAR(30),
            CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
        )`,
  ];

  runStatements(db, statements, callback);
};

exports.down = function (db, callback) {
  const statements = [
    "DROP TABLE IF EXISTS payments",
    "DROP TABLE IF EXISTS bookings",
    "DROP TABLE IF EXISTS court_schedules",
    "DROP TABLE IF EXISTS courts",
    "DROP TABLE IF EXISTS clubs",
    "DROP TABLE IF EXISTS managers",
    "DROP TABLE IF EXISTS users",
  ];

  runStatements(db, statements, callback);
};
