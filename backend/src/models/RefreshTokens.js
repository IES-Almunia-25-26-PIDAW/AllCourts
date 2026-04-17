const { pool } = require("../config/db");

const RefreshToken = {
  create: ({ id, user_id, token_hash, expires_at }) => {
    const sql = `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, user_id, token_hash, expires_at]);
  },

  findByHash: (tokenHash) => {
    const sql = `
      SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
      FROM refresh_tokens
      WHERE token_hash = ?
      LIMIT 1
    `;
    return pool.execute(sql, [tokenHash]);
  },

  revokeByHash: (tokenHash) => {
    const sql = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = ? AND revoked_at IS NULL
    `;
    return pool.execute(sql, [tokenHash]);
  },

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
