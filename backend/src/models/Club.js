//#region MODULES
const { pool } = require('../config/db');
//#endregion

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
      club.description ?? null
    ]);
  },

  getAll: () => {
    const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.id = u.id`;
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.id = u.id
            WHERE cl.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByManagerId: (managerId) => {
    const sql = 'SELECT * FROM clubs WHERE manager_id = ?';
    return pool.execute(sql, [managerId]);
  },

  getByCity: (city) => {
    const sql = 'SELECT * FROM clubs WHERE city = ?';
    return pool.execute(sql, [city]);
  },

  update: (id, data) => {
    const sql = `UPDATE clubs
        SET name = ?, address = ?, city = ?, logo_url = ?, description = ?
        WHERE id = ?`;
    return pool.execute(sql, [data.name, data.address, data.city, data.logo_url ?? null, data.description ?? null, id]);
  },

  delete: (id) => {
    const sql = 'DELETE FROM clubs WHERE id = ?';
    return pool.execute(sql, [id]);
  }
};

module.exports = Club;
