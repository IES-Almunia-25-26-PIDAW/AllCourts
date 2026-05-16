const { pool } = require("../config/db");

/**
 * @module Club
 * Modelo de datos para la gestión de clubes deportivos.
 * Encapsula las operaciones SQL sobre la tabla `clubs`.
 *
 * Cada método devuelve una Promise de `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   clubs → managers  (cl.manager_id = m.id)
 *   managers → users  (m.id          = u.id)
 */
const Club = {
	/**
	 * Create a new club.
	 * @param {Object} club - Club data.
	 * @param {number} club.manager_id
	 * @param {string} club.name
	 * @param {string} club.address
	 * @param {string} club.city
	 * @param {string|null} [club.logo_url]
	 * @param {string|null} [club.description]
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (club) => {
		const sql = `INSERT INTO clubs
        (manager_id, name, address, city, logo_url, description)
        VALUES (?, ?, ?, ?, ?, ?)`;
		return pool.execute(sql, [
			club.manager_id,
			club.name,
			club.address,
			club.city,
			club.logo_url ?? null,
			club.description ?? null,
		]);
	},

	/**
	 * Get all clubs with manager basic info.
	 * @returns {Promise} Promise resolving to clubs.
	 */
	getAll: () => {
		const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.id = u.id`;
		return pool.execute(sql);
	},

	/**
	 * Get a club by id.
	 * @param {number} id - Club id.
	 * @returns {Promise} Promise resolving to the club record.
	 */
	getById: (id) => {
		const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.id = u.id
            WHERE cl.id = ?`;
		return pool.execute(sql, [id]);
	},

	/**
	 * Get clubs belonging to a manager.
	 * @param {number} managerId - Manager id.
	 * @returns {Promise} Promise resolving to clubs.
	 */
	getByManagerId: (managerId) => {
		const sql = "SELECT * FROM clubs WHERE manager_id = ?";
		return pool.execute(sql, [managerId]);
	},

	/**
	 * Get clubs by city.
	 * @param {string} city
	 * @returns {Promise} Promise resolving to clubs.
	 */
	getByCity: (city) => {
		const sql = "SELECT * FROM clubs WHERE city = ?";
		return pool.execute(sql, [city]);
	},

	/**
	 * Update club fields.
	 * @param {number} id - Club id.
	 * @param {Object} data - Fields to update.
	 * @returns {Promise} Promise resolving to the update result.
	 */
	update: (id, data) => {
		const sql = `UPDATE clubs
        SET name = ?, address = ?, city = ?, logo_url = ?, description = ?
        WHERE id = ?`;
		return pool.execute(sql, [
			data.name,
			data.address,
			data.city,
			data.logo_url ?? null,
			data.description ?? null,
			id,
		]);
	},

	/**
	 * Delete a club.
	 * @param {number} id - Club id.
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM clubs WHERE id = ?";
		return pool.execute(sql, [id]);
	},
};

module.exports = Club;
