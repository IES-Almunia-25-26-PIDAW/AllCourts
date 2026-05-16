const { pool } = require("../config/db");

/**
 * @module Court
 * Modelo de datos para la gestión de pistas deportivas.
 * Encapsula las operaciones SQL sobre la tabla `courts`.
 *
 * Cada método devuelve una Promise de `pool.execute()`,
 * que se gestiona mediante `await`.
 *
 * Relaciones:
 *   courts → clubs  (c.club_id = cl.id)
 *
 * Precios almacenados por duración: price_60, price_90, price_120 (en minutos).
 * `min_unit_min` define el mínimo de reserva en minutos (por defecto 30).
 */
const Court = {
	/**
	 * Create a new court.
	 * @param {Object} court - Court data.
	 * @param {number} court.club_id
	 * @param {string} court.name
	 * @param {string} court.surface_type
	 * @param {string} court.sport
	 * @param {number} court.price_60
	 * @param {number} court.price_90
	 * @param {number} court.price_120
	 * @param {number} [court.min_unit_min=30]
	 * @param {string|null} [court.image_url]
	 * @param {string|null} [court.description]
	 * @param {boolean} [court.is_indoor=false]
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (court) => {
		const sql = `INSERT INTO courts
        (club_id, name, surface_type, sport, price_60, price_90, price_120, min_unit_min, image_url, description, is_indoor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		return pool.execute(sql, [
			court.club_id,
			court.name,
			court.surface_type,
			court.sport,
			court.price_60,
			court.price_90,
			court.price_120,
			court.min_unit_min || 30,
			court.image_url ?? null,
			court.description ?? null,
			court.is_indoor ?? false,
		]);
	},

	/**
	 * Get all courts, optionally filtered by fields.
	 * @param {Object} [filters]
	 * @returns {Promise} Promise resolving to courts.
	 */
	getAll: (filters = {}) => {
		const conditions = [];
		const params = [];

		if (filters.sport !== undefined) {
			conditions.push("c.sport = ?");
			params.push(filters.sport);
		}

		if (filters.surface_type !== undefined) {
			conditions.push("c.surface_type = ?");
			params.push(filters.surface_type);
		}

		if (filters.is_indoor !== undefined) {
			conditions.push("c.is_indoor = ?");
			params.push(filters.is_indoor);
		}

		const whereClause =
			conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
		const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id${whereClause}`;
		return pool.execute(sql, params);
	},

	/**
	 * Get court by id.
	 * @param {number} id - Court id.
	 * @returns {Promise} Promise resolving to the court.
	 */
	getById: (id) => {
		const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE c.id = ?`;
		return pool.execute(sql, [id]);
	},

	/**
	 * Get courts for a club.
	 * @param {number} clubId - Club id.
	 * @returns {Promise} Promise resolving to courts.
	 */
	getByClubId: (clubId) => {
		const sql = "SELECT * FROM courts WHERE club_id = ?";
		return pool.execute(sql, [clubId]);
	},

	/**
	 * Get courts by city.
	 * @param {string} city
	 * @returns {Promise} Promise resolving to courts.
	 */
	getByCity: (city) => {
		const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.city = ?`;
		return pool.execute(sql, [city]);
	},

	/**
	 * Update court fields.
	 * @param {number} id - Court id.
	 * @param {Object} data - Fields to update.
	 * @returns {Promise} Promise resolving to the update result.
	 */
	update: (id, data) => {
		const sql = `UPDATE courts 
        SET name = ?, surface_type = ?, sport = ?, price_60 = ?, price_90 = ?, price_120 = ?, min_unit_min = ?, image_url = ?, description = ?, is_indoor = ?
        WHERE id = ?`;
		return pool.execute(sql, [
			data.name,
			data.surface_type,
			data.sport,
			data.price_60,
			data.price_90,
			data.price_120,
			data.min_unit_min ?? null,
			data.image_url ?? null,
			data.description ?? null,
			data.is_indoor ?? null,
			id,
		]);
	},

	/**
	 * Delete a court.
	 * @param {number} id - Court id.
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM courts WHERE id = ?";
		return pool.execute(sql, [id]);
	},
};

module.exports = Court;
