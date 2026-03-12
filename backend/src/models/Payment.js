const { pool } = require("../config/db");

const Payment = {
  create: (payment) => {
    const sql = `INSERT INTO payments 
        (booking_id, amount, payment_date, status, method) 
        VALUES (?, ?, ?, ?, ?)`;
    return pool.execute(sql, [
      payment.booking_id,
      payment.amount,
      payment.payment_date,
      payment.status || "pending",
      payment.method,
    ]);
  },

  getAll: () => {
    const sql = `SELECT p.*, 
            b.date as booking_date, b.start_time, b.end_time,
            u.name as user_name, u.email as user_email,
            c.name as court_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            ORDER BY p.payment_date DESC`;
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql = `SELECT p.*, 
            b.date as booking_date, b.start_time, b.end_time,
            u.name as user_name, u.email as user_email,
            c.name as court_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            WHERE p.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByBookingId: (bookingId) => {
    const sql = "SELECT * FROM payments WHERE booking_id = ?";
    return pool.execute(sql, [bookingId]);
  },

  getByUserId: (userId) => {
    const sql = `SELECT p.*, 
            b.date as booking_date, b.start_time, b.end_time,
            c.name as court_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN courts c ON b.court_id = c.id
            WHERE b.user_id = ?
            ORDER BY p.payment_date DESC`;
    return pool.execute(sql, [userId]);
  },

  getByManagerId: (managerId) => {
    const sql = `SELECT p.*, 
            b.date as booking_date, b.start_time, b.end_time,
            u.name as user_name, u.email as user_email,
            c.name as court_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            JOIN courts c ON b.court_id = c.id
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.manager_id = ?
            ORDER BY p.payment_date DESC`;
    return pool.execute(sql, [managerId]);
  },

  updateStatus: (id, status) => {
    const sql = "UPDATE payments SET status = ? WHERE id = ?";
    return pool.execute(sql, [status, id]);
  },

  delete: (id) => {
    const sql = "DELETE FROM payments WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Payment;
