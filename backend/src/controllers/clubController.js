const Club = require('../models/Club');

/**
 * @module clubController
 * Controlador de clubes deportivos.
 * Un club pertenece a un manager y puede tener múltiples pistas (courts).
 * Las consultas de lectura incluyen datos del manager mediante JOIN.
 *
 * Rutas esperadas:
 *   POST   /clubs                         → create         (requiere rol manager)
 *   GET    /clubs                         → getAll
 *   GET    /clubs/:id                     → getById
 *   GET    /clubs/city/:city              → getByCity
 *   GET    /clubs/manager/:managerId      → getByManagerId
 *   PUT    /clubs/:id                     → update         (requiere rol manager)
 *   DELETE /clubs/:id                     → delete         (requiere rol manager)
 */
const clubController = {
  /**
   * Crea un nuevo club asociado a un manager.
   *
   * Body: { name, address?, city?, logo_url?, description? }
   * El manager se toma de req.user.id para evitar suplantaciones.
   * Response 201: { message, id }
   */
  create: async (req, res, next) => {
    try {
      const { name, address, city, logo_url, description } = req.body;
      const [result] = await Club.create({
        manager_id: req.user.id,
        name,
        address,
        city,
        logo_url,
        description
      });
      res.status(201).json({ message: 'Club created successfully', id: result.insertId });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve todos los clubes con nombre y email del manager (JOIN).
   *
   * Response 200: array de clubes
   */
  getAll: async (req, res, next) => {
    try {
      const [rows] = await Club.getAll();
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve un club por su ID con datos del manager incluidos.
   *
   * Params: id
   * Response 200: objeto club
   * Response 404: club no encontrado
   */
  getById: async (req, res, next) => {
    try {
      const [rows] = await Club.getById(req.params.id);
      if (rows.length === 0) return res.status(404).json({ message: 'Club not found' });
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve todos los clubes de una ciudad concreta.
   * Útil para el buscador de pistas por localización.
   *
   * Params: city
   * Response 200: array de clubes (puede ser vacío)
   */
  getByCity: async (req, res, next) => {
    try {
      const [rows] = await Club.getByCity(req.params.city);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve todos los clubes que pertenecen a un manager específico.
   *
   * Params: managerId
   * Response 200: array de clubes (puede ser vacío)
   */
  getByManagerId: async (req, res, next) => {
    try {
      const [rows] = await Club.getByManagerId(req.params.managerId);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Actualiza los datos de un club existente.
   *
   * Params: id
   * Body: { name, address?, city?, logo_url?, description? }
   * Response 200: confirmación
   * Response 404: club no encontrado
   */
  update: async (req, res, next) => {
    try {
      const { name, address, city, logo_url, description } = req.body;
      const [result] = await Club.update(req.params.id, {
        name,
        address,
        city,
        logo_url,
        description
      });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Club not found' });
      res.json({ message: 'Club updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Elimina un club por su ID.
   * ON DELETE CASCADE elimina también todas sus pistas y los horarios de esas pistas.
   *
   * Params: id
   * Response 200: confirmación
   * Response 404: club no encontrado
   */
  delete: async (req, res, next) => {
    try {
      const [result] = await Club.delete(req.params.id);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Club not found' });
      res.json({ message: 'Club deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = clubController;
