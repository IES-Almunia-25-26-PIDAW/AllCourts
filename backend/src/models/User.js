const { pool } = require("../config/db");

/**
 * @module User
 * Modelo de datos para la gestión de usuarios.
 * Encapsula las operaciones SQL sobre la tabla `users`.
 *
 * Cada método devuelve una Promise de `pool.execute()`.
 *
 * `getByEmail` y `getByUsername` devuelven todos los campos incluido `password`
 * y `verification_token` — usar solo internamente, nunca exponer en respuestas.
 */
const User = {
	/**
	 * Create a new user.
	 * @param {Object} user
	 * @param {string} user.id
	 * @param {string} user.name
	 * @param {string} user.username
	 * @param {string} user.email
	 * @param {string} user.password
	 * @param {string} user.role
	 * @param {string|null} user.phone
	 * @param {string|null} user.avatar_url
	 * @returns {Promise} Promise resolving to the insert result.
	 */
	create: (user) => {
		const sql = `INSERT INTO users 
        (id, name, username, email, password, role, phone, avatar_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		return pool.execute(sql, [
			user.id,
			user.name,
			user.username,
			user.email,
			user.password,
			user.role,
			user.phone,
			user.avatar_url,
		]);
	},

	/**
	 * Get public fields for all users.
	 * @returns {Promise} Promise resolving to users.
	 */
	getAll: () => {
		const sql =
			"SELECT id, name, username, email, role, phone, avatar_url, is_verified, created_at, last_login FROM users";
		return pool.execute(sql);
	},

	/**
	 * Get public user fields by id.
	 * @param {string} id
	 * @returns {Promise} Promise resolving to the user.
	 */
	getById: (id) => {
		const sql =
			"SELECT id, name, username, email, role, phone, avatar_url, is_verified, created_at, last_login FROM users WHERE id = ?";
		return pool.execute(sql, [id]);
	},

	/**
	 * Get full user row (includes password). For internal use only.
	 * @param {string} id
	 * @returns {Promise} Promise resolving to the user.
	 */
	getByIdWithPassword: (id) => {
		const sql = "SELECT * FROM users WHERE id = ?";
		return pool.execute(sql, [id]);
	},

	/**
	 * Find a user by email (includes password field).
	 * @param {string} email
	 * @returns {Promise} Promise resolving to the user.
	 */
	getByEmail: (email) => {
		const sql = "SELECT * FROM users WHERE email = ?";
		return pool.execute(sql, [email]);
	},

	/**
	 * Find a user by username (includes password field).
	 * @param {string} username
	 * @returns {Promise} Promise resolving to the user.
	 */
	getByUsername: (username) => {
		const sql = "SELECT * FROM users WHERE username = ?";
		return pool.execute(sql, [username]);
	},

	/**
	 * Update user profile fields.
	 * @param {string} id
	 * @param {Object} data
	 * @returns {Promise} Promise resolving to the update result.
	 */
	update: (id, data) => {
		const sql = `UPDATE users 
        SET name = ?, username = ?, phone = ?, avatar_url = ? 
        WHERE id = ?`;
		return pool.execute(sql, [
			data.name,
			data.username,
			data.phone,
			data.avatar_url,
			id,
		]);
	},

	/**
	 * Update a user's password.
	 * @param {string} id
	 * @param {string} hashedPassword
	 * @returns {Promise} Promise resolving to the update result.
	 */
	updatePassword: (id, hashedPassword) => {
		const sql = "UPDATE users SET password = ? WHERE id = ?";
		return pool.execute(sql, [hashedPassword, id]);
	},

	/**
	 * Set last_login to now for a user.
	 * @param {string} id
	 * @returns {Promise} Promise resolving to the update result.
	 */
	updateLastLogin: (id) => {
		const sql = "UPDATE users SET last_login = NOW() WHERE id = ?";
		return pool.execute(sql, [id]);
	},

	/**
	 * Set an email verification token for a user.
	 * @param {string} id
	 * @param {string} token
	 * @param {string} expiresAt
	 * @returns {Promise} Promise resolving to the update result.
	 */
	setVerificationToken: (id, token, expiresAt) => {
		const sql =
			"UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?";
		return pool.execute(sql, [token, expiresAt, id]);
	},

	/**
	 * Find a user by an active reset/verification token.
	 * @param {string} tokenHash
	 * @returns {Promise} Promise resolving to the user.
	 */
	findByResetToken: (tokenHash) => {
		const sql =
			"SELECT * FROM users WHERE verification_token = ? AND token_expires_at > NOW()";
		return pool.execute(sql, [tokenHash]);
	},

	/**
	 * Clear reset/verification token fields for a user.
	 * @param {string} id
	 * @returns {Promise} Promise resolving to the update result.
	 */
	clearResetToken: (id) => {
		const sql =
			"UPDATE users SET verification_token = NULL, token_expires_at = NULL WHERE id = ?";
		return pool.execute(sql, [id]);
	},

	/**
	 * Verify a user using a valid token.
	 * @param {string} token
	 * @returns {Promise} Promise resolving to the update result.
	 */
	verifyUser: (token) => {
		const sql = `UPDATE users 
        SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL 
        WHERE verification_token = ? AND token_expires_at > NOW()`;
		return pool.execute(sql, [token]);
	},

	/**
	 * Delete a user.
	 * @param {string} id
	 * @returns {Promise} Promise resolving to the delete result.
	 */
	delete: (id) => {
		const sql = "DELETE FROM users WHERE id = ?";
		return pool.execute(sql, [id]);
	},
};

module.exports = User;
