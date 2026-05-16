//#region MODULES
const { pool } = require("../config/db");
//#endregion

/**
 * @module Booking
 * Modelo de datos para la gestión de reservas de pistas.
 * Encapsula todas las operaciones SQL sobre la tabla `bookings`,
 * actuando como capa de acceso a datos (DAL) entre la lógica de negocio
 * y la base de datos MySQL.
 *
 * Cada método devuelve una Promise resuelta por `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   bookings → users    (b.user_id  = u.id)
 *   bookings → courts   (b.court_id = c.id)
 *   courts   → clubs    (c.club_id  = cl.id)
 */
const Booking = {
  create: (booking) => {
    const sql = `INSERT INTO bookings 
        (user_id, court_id, date, start_time, end_time, duration_min, total_price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return pool.execute(sql, [
      booking.user_id,
      booking.court_id,
      booking.date,
      booking.start_time,
      booking.end_time,
      booking.duration_min,
      booking.total_price,
      booking.status || "pending",
    ]);
  },

  getAll: (managerId) => {
    const sql = `SELECT b.*, 
            u.name as user_name, u.email as user_email,
            c.name as court_name, cl.address as court_address, cl.city as court_city
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.manager_id = ?
            ORDER BY b.date DESC, b.start_time DESC`;
    return pool.execute(sql, [managerId]);
  },

  getById: (id) => {
    const sql = `SELECT b.*, 
            u.name as user_name, u.email as user_email,
            c.name as court_name, cl.address as court_address, cl.city as court_city
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            JOIN clubs cl ON c.club_id = cl.id
            WHERE b.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByUserId: (userId) => {
    const sql = `SELECT b.*, 
            c.name as court_name, cl.address as court_address, cl.city as court_city
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN clubs cl ON c.club_id = cl.id
            WHERE b.user_id = ?
            ORDER BY b.date DESC, b.start_time DESC`;
    return pool.execute(sql, [userId]);
  },

  getByCourtId: (courtId) => {
    const sql = `SELECT b.*, 
            u.name as user_name, u.email as user_email
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            WHERE b.court_id = ?
            ORDER BY b.date DESC, b.start_time DESC`;
    return pool.execute(sql, [courtId]);
  },

  getByCourtAndDate: (courtId, date) => {
    const sql = `SELECT start_time, end_time, status
            FROM bookings
            WHERE court_id = ?
            AND date = ?
            AND status != 'cancelled'
            ORDER BY start_time ASC`;
    return pool.execute(sql, [courtId, date]);
  },

  checkAvailability: (courtId, date, startTime, endTime) => {
    const sql = `SELECT * FROM bookings 
        WHERE court_id = ? 
        AND date = ? 
        AND status != 'cancelled'
        AND start_time < ?
        AND end_time > ?`;
    return pool.execute(sql, [
      courtId,
      date,
      endTime,
      startTime,
    ]);
  },

  updateStatus: (id, status, cancelReason = null) => {
    const sql =
      "UPDATE bookings SET status = ?, cancel_reason = ? WHERE id = ?";
    return pool.execute(sql, [status, cancelReason, id]);
  },

  update: (id, data) => {
    const sql = `UPDATE bookings 
        SET date = ?, start_time = ?, end_time = ?, duration_min = ?, total_price = ? 
        WHERE id = ?`;
    return pool.execute(sql, [
      data.date,
      data.start_time,
      data.end_time,
      data.duration_min,
      data.total_price,
      id,
    ]);
  },

  delete: (id) => {
    const sql = "DELETE FROM bookings WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Booking;
