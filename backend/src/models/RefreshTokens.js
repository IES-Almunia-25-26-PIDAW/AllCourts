/**
 * @module RefreshTokens
 * Persistencia de tokens de refresco para sesiones seguras.
 * Permite crear, localizar y revocar tokens almacenados por hash.
 */
const { pool } = require("../config/db");

const RefreshToken = {
  /**
   * Guarda un nuevo token de refresco hasheado en la base de datos.
   *
   * @param {object} data Datos del token.
   * @param {string} data.id Identificador UUID del registro.
   * @param {string} data.user_id Identificador del usuario propietario.
   * @param {string} data.token_hash Hash SHA-256 del token.
   * @param {Date} data.expires_at Fecha de expiración.
   * @returns {Promise<any>} Resultado de la inserción.
   */
  create: ({ id, user_id, token_hash, expires_at }) => {
    const sql = `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, user_id, token_hash, expires_at]);
  },

  /**
   * Busca un token por su hash para validar la sesión de refresco.
   *
   * @param {string} tokenHash Hash del token a buscar.
   * @returns {Promise<any>} Resultado de la consulta.
   */
  findByHash: (tokenHash) => {
    const sql = `
      SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
      FROM refresh_tokens
      WHERE token_hash = ?
      LIMIT 1
    `;
    return pool.execute(sql, [tokenHash]);
  },

  /**
   * Revoca un token de refresco concreto marcándolo con `revoked_at`.
   *
   * @param {string} tokenHash Hash del token a revocar.
   * @returns {Promise<any>} Resultado de la actualización.
   */
  revokeByHash: (tokenHash) => {
    const sql = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = ? AND revoked_at IS NULL
    `;
    return pool.execute(sql, [tokenHash]);
  },

  /**
   * Revoca todos los tokens activos de un usuario.
   *
   * @param {string} userId Identificador del usuario.
   * @returns {Promise<any>} Resultado de la actualización.
   */
  revokeByUserId: (userId) => {
    const sql = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE user_id = ? AND revoked_at IS NULL
    `;
    return pool.execute(sql, [userId]);
  },
};

module.exports = RefreshToken;
