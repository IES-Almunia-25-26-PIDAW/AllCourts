const { pool } = require("../config/db");

/**
 * @module Manager
 * Modelo de datos para la gestión de managers de clubes.
 * Encapsula las operaciones SQL sobre la tabla `managers`.
 *
 * Cada método devuelve una Promise de `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   managers → users   (m.id         = u.id)
 *   managers → clubs   (cl.manager_id = m.id)
 *   clubs    → courts  (c.club_id    = cl.id)
 *
 * `getStats` agrega pistas, reservas e ingresos totales del manager
 * mediante LEFT JOINs para no excluir managers sin actividad.
 */
const Manager = {
	/**
	 * Create a new manager.
	 * @param {Object} manager - Manager record data.
	 * @param {number} manager.id - User id for the manager.
	 * @param {boolean} [manager.subscription_active=false]
	 * @param {string|null} manager.subscription_start
	 * @param {string|null} manager.subscription_end
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (manager) => {
		const sql = `INSERT INTO managers 
        (id, subscription_active, subscription_start, subscription_end) 
        VALUES (?, ?, ?, ?)`;
		return pool.execute(sql, [
			manager.id,
			manager.subscription_active || false,
			manager.subscription_start,
			manager.subscription_end,
		]);
	},

	/**
	 * Get all managers with basic user info.
	 * @returns {Promise} Promise resolving to an array of managers.
	 */
	getAll: () => {
		const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id`;
		return pool.execute(sql);
	},

	/**
	 * Get a manager by id.
	 * @param {number} id - Manager id.
	 * @returns {Promise} Promise resolving to the manager record.
	 */
	getById: (id) => {
		const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id 
        WHERE m.id = ?`;
		return pool.execute(sql, [id]);
	},

	/**
	 * Alias of getById for clarity when using a user id.
	 * @param {number} userId - User id (manager id).
	 * @returns {Promise} Promise resolving to the manager record.
	 */
	getByUserId: (userId) => {
		const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id 
        WHERE m.id = ?`;
		return pool.execute(sql, [userId]);
	},

	/**
	 * Find a manager by the user's email.
	 * @param {string} email - User email.
	 * @returns {Promise} Promise resolving to the manager record.
	 */
	getByEmail: (email) => {
		const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id 
        WHERE u.email = ?`;
		return pool.execute(sql, [email]);
	},

	/**
	 * Update subscription dates and active flag for a manager.
	 * @param {number} id - Manager id.
	 * @param {Object} subscriptionData - Subscription fields.
	 * @param {boolean} subscriptionData.subscription_active
	 * @param {string|null} subscriptionData.subscription_start
	 * @param {string|null} subscriptionData.subscription_end
	 * @returns {Promise} Promise resolving to the update result.
	 */
	updateSubscription: (id, subscriptionData) => {
		const sql = `UPDATE managers 
        SET subscription_active = ?, subscription_start = ?, subscription_end = ? 
        WHERE id = ?`;
		return pool.execute(sql, [
			subscriptionData.subscription_active,
			subscriptionData.subscription_start,
			subscriptionData.subscription_end,
			id,
		]);
	},

	/**
	 * Update Stripe-related subscription identifiers and status.
	 * @param {number} id - Manager id.
	 * @param {Object} stripeData - Stripe identifiers and status.
	 * @param {string|null} stripeData.stripeCustomerId
	 * @param {string|null} stripeData.stripeSubscriptionId
	 * @param {string|null} stripeData.subscriptionStatus
	 * @returns {Promise} Promise resolving to the update result.
	 */
	updateStripeSubscriptionData: (
		id,
		{ stripeCustomerId, stripeSubscriptionId, subscriptionStatus },
	) => {
		const sql = `UPDATE managers 
        SET stripe_customer_id = ?, stripe_subscription_id = ?, subscription_status = ? 
        WHERE id = ?`;
		return pool.execute(sql, [
			stripeCustomerId,
			stripeSubscriptionId,
			subscriptionStatus,
			id,
		]);
	},

	/**
	 * Get courts managed by a manager through their clubs.
	 * @param {number} managerId - Manager id.
	 * @returns {Promise} Promise resolving to an array of courts.
	 */
	getCourts: (managerId) => {
		const sql = `SELECT c.* FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.manager_id = ?`;
		return pool.execute(sql, [managerId]);
	},

	/**
	 * Get aggregated stats for a manager: total courts, bookings and revenue.
	 * @param {number} managerId - Manager id.
	 * @returns {Promise} Promise resolving to the aggregated stats.
	 */
	getStats: (managerId) => {
		const sql = `SELECT 
            COUNT(DISTINCT c.id) as total_courts,
            COUNT(DISTINCT b.id) as total_bookings,
            COALESCE(SUM(p.amount), 0) as total_revenue
            FROM managers m
            LEFT JOIN clubs cl ON m.id = cl.manager_id
            LEFT JOIN courts c ON cl.id = c.club_id
            LEFT JOIN bookings b ON c.id = b.court_id
            LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'success'
            WHERE m.id = ?
            GROUP BY m.id`;
		return pool.execute(sql, [managerId]);
	},

	/**
	 * Delete a manager record.
	 * @param {number} id - Manager id.
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM managers WHERE id = ?";
		return pool.execute(sql, [id]);
	},
};

module.exports = Manager;
