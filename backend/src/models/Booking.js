const { pool } = require("../config/db");

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

  getAll: () => {
    const sql = `SELECT b.*, 
            u.name as user_name, u.email as user_email,
            c.name as court_name, cl.address as court_address, cl.city as court_city
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            JOIN clubs cl ON c.club_id = cl.id
            ORDER BY b.date DESC, b.start_time DESC`;
    return pool.execute(sql);
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

  checkAvailability: (courtId, date, startTime, endTime) => {
    const sql = `SELECT * FROM bookings 
        WHERE court_id = ? 
        AND date = ? 
        AND status != 'cancelled'
        AND ((start_time < ? AND end_time > ?) 
            OR (start_time < ? AND end_time > ?)
            OR (start_time >= ? AND end_time <= ?))`;
    return pool.execute(sql, [
      courtId,
      date,
      endTime,
      startTime,
      endTime,
      endTime,
      startTime,
      endTime,
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
