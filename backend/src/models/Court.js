const { pool } = require("../config/db");

const Court = {
  create: (court) => {
    const sql = `INSERT INTO courts
        (club_id, name, surface_type, sport, price_60, price_90, price_120, min_unit_min, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return pool.execute(sql, [
      court.club_id,
      court.name,
      court.surface_type,
      court.sport,
      court.price_60,
      court.price_90,
      court.price_120,
      court.min_unit_min || 30,
      court.image_url,
      court.description,
    ]);
  },

  getAll: () => {
    const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id`;
    return pool.execute(sql);
  },

  getById: (id) => {
    const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE c.id = ?`;
    return pool.execute(sql, [id]);
  },

  getByClubId: (clubId) => {
    const sql = "SELECT * FROM courts WHERE club_id = ?";
    return pool.execute(sql, [clubId]);
  },

  getByCity: (city) => {
    const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id
            WHERE cl.city = ?`;
    return pool.execute(sql, [city]);
  },

  update: (id, data) => {
    const sql = `UPDATE courts 
        SET name = ?, surface_type = ?, sport = ?, price_60 = ?, price_90 = ?, price_120 = ?, min_unit_min = ?, image_url = ?, description = ?
        WHERE id = ?`;
    return pool.execute(sql, [
      data.name,
      data.surface_type,
      data.sport,
      data.price_60,
      data.price_90,
      data.price_120,
      data.min_unit_min,
      data.image_url,
      data.description,
      id,
    ]);
  },

  delete: (id) => {
    const sql = "DELETE FROM courts WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Court;
