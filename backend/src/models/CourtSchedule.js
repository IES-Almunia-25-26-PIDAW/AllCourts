const { pool } = require("../config/db");

/**
 * @module CourtSchedule
 * Modelo de datos para la gestión de horarios de pistas.
 * Encapsula las operaciones SQL sobre la tabla `court_schedules`.
 *
 * Cada método devuelve una Promise de `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   court_schedules → courts  (court_id = c.id)
 *
 * `day_of_week` sigue la convención del proyecto: 0 = domingo … 6 = sábado.
 * `upsert` es la operación principal para definir horarios — evita
 * duplicados por (court_id, day_of_week) usando ON DUPLICATE KEY UPDATE.
 */
const CourtSchedule = {
	/**
	 * Create a court schedule entry.
	 * @param {Object} schedule
	 * @param {number} schedule.court_id
	 * @param {number} schedule.day_of_week - 0=Sunday..6=Saturday
	 * @param {string} schedule.opening_time
	 * @param {string} schedule.closing_time
	 * @param {boolean} [schedule.is_closed=false]
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (schedule) => {
		const sql = `INSERT INTO court_schedules
        (court_id, day_of_week, opening_time, closing_time, is_closed)
        VALUES (?, ?, ?, ?, ?)`;
		return pool.execute(sql, [
			schedule.court_id,
			schedule.day_of_week,
			schedule.opening_time,
			schedule.closing_time,
			schedule.is_closed || false,
		]);
	},
	/**
	 * Upsert a schedule for a court and day (insert or update if exists).
	 * @param {Object} schedule
	 * @param {number} schedule.court_id
	 * @param {number} schedule.day_of_week
	 * @param {string} schedule.opening_time
	 * @param {string} schedule.closing_time
	 * @param {boolean} [schedule.is_closed=false]
	 * @returns {Promise} Promise resolving to the upsert result.
	 */
	upsert: (schedule) => {
		const sql = `INSERT INTO court_schedules
        (court_id, day_of_week, opening_time, closing_time, is_closed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            opening_time = VALUES(opening_time),
            closing_time = VALUES(closing_time),
            is_closed = VALUES(is_closed)`;
		return pool.execute(sql, [
			schedule.court_id,
			schedule.day_of_week,
			schedule.opening_time,
			schedule.closing_time,
			schedule.is_closed || false,
		]);
	},

	/**
	 * Get schedules for a court ordered by day.
	 * @param {number} courtId
	 * @returns {Promise} Promise resolving to schedule rows.
	 */
	getByCourtId: (courtId) => {
		const sql = `SELECT * FROM court_schedules
            WHERE court_id = ?
            ORDER BY day_of_week ASC`;
		return pool.execute(sql, [courtId]);
	},

	/**
	 * Get schedule for a court on a specific day.
	 * @param {number} courtId
	 * @param {number} dayOfWeek
	 * @returns {Promise} Promise resolving to the schedule row.
	 */
	getByCourtAndDay: (courtId, dayOfWeek) => {
		const sql =
			"SELECT * FROM court_schedules WHERE court_id = ? AND day_of_week = ?";
		return pool.execute(sql, [courtId, dayOfWeek]);
	},

	/**
	 * Update a schedule entry.
	 * @param {number} id - Schedule id.
	 * @param {Object} data - Fields to update.
	 * @returns {Promise} Promise resolving to the update result.
	 */
	update: (id, data) => {
		const sql = `UPDATE court_schedules
        SET opening_time = ?, closing_time = ?, is_closed = ?
        WHERE id = ?`;
		return pool.execute(sql, [
			data.opening_time,
			data.closing_time,
			data.is_closed,
			id,
		]);
	},

	/**
	 * Delete a schedule entry.
	 * @param {number} id - Schedule id.
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM court_schedules WHERE id = ?";
		return pool.execute(sql, [id]);
	},

	/**
	 * Delete all schedules for a court.
	 * @param {number} courtId
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	deleteByCourtId: (courtId) => {
		const sql = "DELETE FROM court_schedules WHERE court_id = ?";
		return pool.execute(sql, [courtId]);
	},
};

module.exports = CourtSchedule;
