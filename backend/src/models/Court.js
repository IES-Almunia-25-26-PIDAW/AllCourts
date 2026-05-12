//#region MODULES
const { pool } = require("../config/db");
//#endregion

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
      court.image_url,
      court.description,
      court.is_indoor ?? false,
    ]);
  },

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

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT c.*, cl.name as club_name, cl.address, cl.city, cl.logo_url
            FROM courts c
            JOIN clubs cl ON c.club_id = cl.id${whereClause}`;
    return pool.execute(sql, params);
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
        SET name = ?, surface_type = ?, sport = ?, price_60 = ?, price_90 = ?, price_120 = ?, min_unit_min = ?, image_url = ?, description = ?, is_indoor = ?
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
      data.is_indoor,
      id,
    ]);
  },

  delete: (id) => {
    const sql = "DELETE FROM courts WHERE id = ?";
    return pool.execute(sql, [id]);
  },
};

module.exports = Court;
