const { pool } = require("../config/db");

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
      club.logo_url,
      club.description,
    ]);
  },

  getAll: () => {
    const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.user_id = u.id`;
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql = `SELECT cl.*, u.name as manager_name, u.email as manager_email
            FROM clubs cl
            JOIN managers m ON cl.manager_id = m.id
            JOIN users u ON m.user_id = u.id
            WHERE cl.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByManagerId: (managerId) => {
    const sql = "SELECT * FROM clubs WHERE manager_id = ?";
    return pool.execute(sql, [managerId]);
  },

  getByCity: (city) => {
    const sql = "SELECT * FROM clubs WHERE city = ?";
    return pool.execute(sql, [city]);
  },

  update: (id, data) => {
    const sql = `UPDATE clubs
        SET name = ?, address = ?, city = ?, logo_url = ?, description = ?
        WHERE id = ?`;
    return pool.execute(sql, [
      data.name,
      data.address,
      data.city,
      data.logo_url,
      data.description,
      id,
    ]);
  },

  delete: (id) => {
    const sql = "DELETE FROM clubs WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Club;
