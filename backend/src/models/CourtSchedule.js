const { pool } = require("../config/db");

const CourtSchedule = {
  create: (schedule) => {
    const sql = `INSERT INTO court_schedules
        (court_id, day_of_week, opening_time, closing_time, is_closed)
        VALUES (?, ?, ?, ?, ?)`;
    return pool.execute(sql, [
      schedule.court_id,
      schedule.day_of_week,
      schedule.opening_time,
      schedule.closing_time,
      schedule.is_closed || false,
    ]);
  },

  // Crear o actualizar el horario para una pista y día determinados (maneja INSERT o UPDATE)
  upsert: (schedule) => {
    const sql = `INSERT INTO court_schedules
        (court_id, day_of_week, opening_time, closing_time, is_closed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            opening_time = VALUES(opening_time),
            closing_time = VALUES(closing_time),
            is_closed = VALUES(is_closed)`;
    return pool.execute(sql, [
      schedule.court_id,
      schedule.day_of_week,
      schedule.opening_time,
      schedule.closing_time,
      schedule.is_closed || false,
    ]);
  },

  getByCourtId: (courtId) => {
    const sql = `SELECT * FROM court_schedules
            WHERE court_id = ?
            ORDER BY day_of_week ASC`;
    return pool.execute(sql, [courtId]);
  },

  getByCourtAndDay: (courtId, dayOfWeek) => {
    const sql =
      "SELECT * FROM court_schedules WHERE court_id = ? AND day_of_week = ?";
    return pool.execute(sql, [courtId, dayOfWeek]);
  },

  update: (id, data) => {
    const sql = `UPDATE court_schedules
        SET opening_time = ?, closing_time = ?, is_closed = ?
        WHERE id = ?`;
    return pool.execute(sql, [
      data.opening_time,
      data.closing_time,
      data.is_closed,
      id,
    ]);
  },

  delete: (id) => {
    const sql = "DELETE FROM court_schedules WHERE id = ?";
    return pool.execute(sql, [id]);
  },

  deleteByCourtId: (courtId) => {
    const sql = "DELETE FROM court_schedules WHERE court_id = ?";
    return pool.execute(sql, [courtId]);
  },
};

module.exports = CourtSchedule;
