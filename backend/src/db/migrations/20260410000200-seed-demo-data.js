//! DATOS DE PRUEBA

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
    `INSERT INTO users (name, username, email, password, role, phone, avatar_url, is_verified)
     SELECT 'Demo Manager', 'demo-manager', 'manager@allcourts.test', '$2b$10$uW5E0x7f8Z9x1J3r0rU8uO8h4qvS2r8xD7hF6pNqV9mQ4c6xL0i2S', 'manager', NULL, NULL, TRUE
     WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'manager@allcourts.test')`,
    `INSERT INTO managers (user_id, subscription_active, subscription_start, subscription_end)
     SELECT id, TRUE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY)
     FROM users
      WHERE email = 'manager@allcourts.test'
      AND NOT EXISTS (SELECT 1 FROM managers WHERE user_id = users.id)`,
    `INSERT INTO clubs (manager_id, name, address, city, logo_url, description)
     SELECT m.id, 'AllCourts Center', 'Calle Ejemplo 123', 'Madrid', '/logoallcourts.png', 'Club de ejemplo con pistas disponibles para pruebas'
     FROM managers m
     JOIN users u ON m.user_id = u.id
      WHERE u.email = 'manager@allcourts.test'
      AND NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'AllCourts Center')`,
    `INSERT INTO courts (club_id, name, surface_type, sport, price_60, price_90, price_120, min_unit_min, image_url, description)
     SELECT c.id, 'Pista Central', 'dura', 'padel', 24.00, 32.00, 40.00, 60, '/home.webp', 'Pista de ejemplo para reservar y probar el flujo principal'
     FROM clubs c
      WHERE c.name = 'AllCourts Center'
      AND NOT EXISTS (SELECT 1 FROM courts WHERE name = 'Pista Central')`,
    `INSERT INTO courts (club_id, name, surface_type, sport, price_60, price_90, price_120, min_unit_min, image_url, description)
     SELECT c.id, 'Pista Norte', 'cesped_artificial', 'tenis', 18.00, 26.00, 34.00, 60, '/home.webp', 'Segunda pista de ejemplo para probar el listado y detalle'
     FROM clubs c
      WHERE c.name = 'AllCourts Center'
      AND NOT EXISTS (SELECT 1 FROM courts WHERE name = 'Pista Norte')`,
  ];

  runStatements(db, statements, callback);
};

exports.down = function (db, callback) {
  const statements = [
    "DELETE FROM courts WHERE name IN ('Pista Central', 'Pista Norte')",
    "DELETE FROM clubs WHERE name = 'AllCourts Center'",
    "DELETE FROM managers WHERE user_id IN (SELECT id FROM users WHERE email = 'manager@allcourts.test')",
    "DELETE FROM users WHERE email = 'manager@allcourts.test'",
  ];

  runStatements(db, statements, callback);
};
