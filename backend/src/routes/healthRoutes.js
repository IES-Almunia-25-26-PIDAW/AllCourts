const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

/**
 * @module healthRouter
 * Rutas de estado del servidor.
 *
 * GET /health → Estado del servidor y conexión a base de datos
 */

router.get("/", async (req, res) => {
  const uptime = process.uptime();
  const version = process.env.npm_package_version || "dev";

  const result = {
    status: "ok",
    uptime,
    version,
  };

  try {
    await pool.query("SELECT 1");
    result.db = { ok: true };
  } catch (err) {
    result.db = { ok: false, error: err.message };
    return res.status(503).json(result);
  }

  res.json(result);
});

module.exports = router;
