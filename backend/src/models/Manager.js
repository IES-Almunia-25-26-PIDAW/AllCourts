//#region MODULES
const { pool } = require("../config/db");
//#endregion

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

  getAll: () => {
    const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id`;
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id 
        WHERE m.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByUserId: (userId) => {
    const sql = `SELECT m.*, u.name, u.email, u.phone 
        FROM managers m 
        JOIN users u ON m.id = u.id 
        WHERE m.id = ?`;
    return pool.execute(sql, [userId]);
  },

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

  getCourts: (managerId) => {
    const sql = `SELECT c.* FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.manager_id = ?`;
    return pool.execute(sql, [managerId]);
  },

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

  delete: (id) => {
    const sql = "DELETE FROM managers WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Manager;
