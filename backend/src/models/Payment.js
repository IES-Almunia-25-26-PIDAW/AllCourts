const { pool } = require("../config/db");

/**
 * @module Payment
 * Modelo de datos para la gestión de pagos.
 * Encapsula las operaciones SQL sobre la tabla `payments`.
 *
 * Cada método devuelve una Promise de `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   payments → bookings  (p.booking_id  = b.id)
 *   bookings → users     (b.user_id     = u.id)
 *   bookings → courts    (b.court_id    = c.id)
 *   courts   → clubs     (c.club_id     = cl.id)
 *   clubs    → managers  (cl.manager_id = m.id)
 */
/**
 * Payment model: operaciones sobre la tabla `payments`.
 */
const Payment = {
	/**
	 * Create a payment record.
	 * @param {Object} payment
	 * @param {number} payment.booking_id
	 * @param {number} payment.amount
	 * @param {string|null} [payment.payment_date]
	 * @param {string} [payment.status='pending']
	 * @param {string} payment.method
	 * @param {string|null} [payment.stripe_payment_intent_id]
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (payment) => {
		const sql = `INSERT INTO payments 
        (booking_id, amount, payment_date, status, method, stripe_payment_intent_id) 
        VALUES (?, ?, ?, ?, ?, ?)`;
		return pool.execute(sql, [
			payment.booking_id,
			payment.amount,
			payment.payment_date || null,
			payment.status || "pending",
			payment.method,
			payment.stripe_payment_intent_id || null,
		]);
	},

	/**
	 * Get all payments for a manager.
	 * @param {number} managerId
	 * @returns {Promise} Promise resolving to payments.
	 */
	getAll: (managerId) => {
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

	/**
	 * Get a payment by id.
	 * @param {number} id
	 * @returns {Promise} Promise resolving to the payment.
	 */
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

	/**
	 * Get payments for a booking.
	 * @param {number} bookingId
	 * @returns {Promise} Promise resolving to payments.
	 */
	getByBookingId: (bookingId) => {
		const sql = "SELECT * FROM payments WHERE booking_id = ?";
		return pool.execute(sql, [bookingId]);
	},

	/**
	 * Get payments made by a user.
	 * @param {number} userId
	 * @returns {Promise} Promise resolving to payments.
	 */
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

	/**
	 * Get payments for a manager.
	 * @param {number} managerId
	 * @returns {Promise} Promise resolving to payments.
	 */
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

	/**
	 * Update payment status.
	 * @param {number} id
	 * @param {string} status
	 * @returns {Promise} Promise resolving to update result.
	 */
	updateStatus: (id, status) => {
		const sql = "UPDATE payments SET status = ? WHERE id = ?";
		return pool.execute(sql, [status, id]);
	},

	/**
	 * Delete a payment.
	 * @param {number} id
	 * @returns {Promise} Promise resolving to delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM payments WHERE id = ?";
		return pool.execute(sql, [id]);
	},
};

module.exports = Payment;
