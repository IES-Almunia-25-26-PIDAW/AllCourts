const Court = require("../models/Court");

/**
 * @module courtController
 * Controlador de pistas deportivas.
 * Una pista pertenece a un club y tiene precios para 3 duraciones estándar
 * (60, 90 y 120 minutos), tipo de superficie y deporte.
 * Las consultas de lectura incluyen datos del club mediante JOIN.
 *
 * Rutas esperadas:
 *   POST   /courts                    → create         (requiere rol manager)
 *   GET    /courts                    → getAll
 *   GET    /courts/:id                → getById
 *   GET    /courts/club/:clubId       → getByClubId
 *   GET    /courts/city/:city         → getByCity
 *   PUT    /courts/:id                → update         (requiere rol manager)
 *   DELETE /courts/:id                → delete         (requiere rol manager)
 */
const courtController = {
    /**
     * Crea una nueva pista asociada a un club.
     *
     * Body: {
     *   club_id, name, surface_type, sport,
     *   price_60, price_90, price_120,
     *   min_unit_min?, image_url?, description?
     * }
     * surface_type: 'tierra_batida' | 'cesped_natural' | 'cesped_artificial' | 'dura' | 'arena' | 'parque'
     * sport: 'tenis' | 'padel' | 'pickleball' | 'baloncesto_3x3' | 'baloncesto_5x5' |
     *        'futbol_5' | 'futbol_7' | 'futbol_11' | 'voley' | 'balonmano'
     * Response 201: { message, id }
     */
    create: async (req, res, next) => {
        try {
            const {
                club_id,
                name,
                surface_type,
                sport,
                price_60,
                price_90,
                price_120,
                min_unit_min,
                image_url,
                description,
            } = req.body;
            const [result] = await Court.create({
                club_id,
                name,
                surface_type,
                sport,
                price_60,
                price_90,
                price_120,
                min_unit_min,
                image_url,
                description,
            });
            res
                .status(201)
                .json({ message: "Court created successfully", id: result.insertId });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todas las pistas con datos del club (nombre, dirección, ciudad).
     *
     * Response 200: array de pistas
     */
    getAll: async (req, res, next) => {
        try {
            const [rows] = await Court.getAll();
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve una pista por su ID con datos del club incluidos.
     *
     * Params: id
     * Response 200: objeto pista
     * Response 404: pista no encontrada
     */
    getById: async (req, res, next) => {
        try {
            const [rows] = await Court.getById(req.params.id);
            if (rows.length === 0)
                return res.status(404).json({ message: "Court not found" });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todas las pistas de un club concreto.
     *
     * Params: clubId
     * Response 200: array de pistas (puede ser vacío)
     */
    getByClubId: async (req, res, next) => {
        try {
            const [rows] = await Court.getByClubId(req.params.clubId);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todas las pistas disponibles en una ciudad.
     * Filtra mediante JOIN con clubs WHERE city = ?
     *
     * Params: city
     * Response 200: array de pistas (puede ser vacío)
     */
    getByCity: async (req, res, next) => {
        try {
            const [rows] = await Court.getByCity(req.params.city);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Actualiza los datos de una pista existente.
     *
     * Params: id
     * Body: { name, surface_type, sport, price_60, price_90, price_120, min_unit_min?, image_url?, description? }
     * Response 200: confirmación
     * Response 404: pista no encontrada
     */
    update: async (req, res, next) => {
        try {
            const {
                name,
                surface_type,
                sport,
                price_60,
                price_90,
                price_120,
                min_unit_min,
                image_url,
                description,
            } = req.body;
            const [result] = await Court.update(req.params.id, {
                name,
                surface_type,
                sport,
                price_60,
                price_90,
                price_120,
                min_unit_min,
                image_url,
                description,
            });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Court not found" });
            res.json({ message: "Court updated successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Elimina una pista por su ID.
     * ON DELETE CASCADE elimina también sus horarios (court_schedules) y reservas.
     *
     * Params: id
     * Response 200: confirmación
     * Response 404: pista no encontrada
     */
    delete: async (req, res, next) => {
        try {
            const [result] = await Court.delete(req.params.id);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Court not found" });
            res.json({ message: "Court deleted successfully" });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = courtController;
