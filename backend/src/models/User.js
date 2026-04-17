//#region MODULES
const { pool } = require("../config/db");
//#endregion

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
  create: (user) => {
    const sql = `INSERT INTO users 
        (id, name, username, email, password, role, phone, avatar_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
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

  getAll: () => {
    const sql =
      "SELECT id, name, username, email, role, phone, avatar_url, is_verified, created_at, last_login FROM users";
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql =
      "SELECT id, name, username, email, role, phone, avatar_url, is_verified, created_at, last_login FROM users WHERE id = ?";
    return pool.execute(sql, [id]);
  },

  getByEmail: (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    return pool.execute(sql, [email]);
  },

  getByUsername: (username) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    return pool.execute(sql, [username]);
  },

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

  updatePassword: (id, hashedPassword) => {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    return pool.execute(sql, [hashedPassword, id]);
  },

  updateLastLogin: (id) => {
    const sql = "UPDATE users SET last_login = NOW() WHERE id = ?";
    return pool.execute(sql, [id]);
  },

  setVerificationToken: (id, token, expiresAt) => {
    const sql =
      "UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?";
    return pool.execute(sql, [token, expiresAt, id]);
  },

  verifyUser: (token) => {
    const sql = `UPDATE users 
        SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL 
        WHERE verification_token = ? AND token_expires_at > NOW()`;
    return pool.execute(sql, [token]);
  },

  delete: (id) => {
    const sql = "DELETE FROM users WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = User;
