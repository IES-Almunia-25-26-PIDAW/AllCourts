const Manager = require("../models/Manager");

/**
 * @module managerController
 * Controlador de managers (gestores de clubes).
 * Un manager es un usuario con role='manager' que tiene una fila asociada
 * en la tabla managers con información de suscripción.
 * La creación del manager se hace automáticamente al registrarse en authController.
 *
 * Rutas esperadas:
 *   GET    /managers                       → getAll
 *   GET    /managers/:id                   → getById
 *   GET    /managers/user/:userId          → getByUserId
 *   PATCH  /managers/:id/subscription     → updateSubscription
 *   GET    /managers/:id/courts           → getCourts
 *   GET    /managers/:id/stats            → getStats
 *   DELETE /managers/:id                  → delete
 */
const managerController = {
	/**
	 * Devuelve todos los managers con sus datos de usuario (JOIN con users).
	 *
	 * Response 200: array de managers
	 */
	getAll: async (req, res, next) => {
		try {
			const [rows] = await Manager.getAll();
			res.json(rows);
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Devuelve un manager por su ID de la tabla managers.
	 *
	 * Params: id
	 * Response 200: objeto manager con datos de usuario
	 * Response 404: manager no encontrado
	 */
	getById: async (req, res, next) => {
		try {
			const [rows] = await Manager.getById(req.params.id);
			if (rows.length === 0)
				return res.status(404).json({ message: "Manager not found" });
			res.json(rows[0]);
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Devuelve el manager asociado al id del usuario autenticado.
	 *
	 * Params: userId
	 * Response 200: objeto manager
	 * Response 404: manager no encontrado
	 */
	getByUserId: async (req, res, next) => {
		try {
			const [rows] = await Manager.getByUserId(req.params.userId);
			if (rows.length === 0)
				return res.status(404).json({ message: "Manager not found" });
			res.json(rows[0]);
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Actualiza el estado y fechas de la suscripción de un manager.
	 *
	 * Params: id
	 * Body: { subscription_active, subscription_start, subscription_end }
	 * Response 200: confirmación
	 * Response 404: manager no encontrado
	 */
	updateSubscription: async (req, res, next) => {
		try {
			const {
				subscription_active,
				subscription_start,
				subscription_end,
			} = req.body;
			const [result] = await Manager.updateSubscription(req.params.id, {
				subscription_active,
				subscription_start,
				subscription_end,
			});
			if (result.affectedRows === 0)
				return res.status(404).json({ message: "Manager not found" });
			res.json({ message: "Subscription updated successfully" });
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Devuelve todas las pistas que pertenecen a los clubes de un manager.
	 * Hace JOIN courts → clubs WHERE clubs.manager_id = ?
	 *
	 * Params: id (manager_id)
	 * Response 200: array de pistas
	 */
	getCourts: async (req, res, next) => {
		try {
			const [rows] = await Manager.getCourts(req.params.id);
			res.json(rows);
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Devuelve estadísticas agregadas del manager:
	 * total de pistas, total de reservas y revenue total (pagos con status='success').
	 *
	 * Params: id (manager_id)
	 * Response 200: { total_courts, total_bookings, total_revenue }
	 * Response 404: manager no encontrado
	 */
	getStats: async (req, res, next) => {
		try {
			const [rows] = await Manager.getStats(req.params.id);
			if (rows.length === 0)
				return res.status(404).json({ message: "Manager not found" });
			res.json(rows[0]);
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Elimina un manager por su ID.
	 * Al tener ON DELETE CASCADE, también elimina sus clubes (y en cascada, las pistas).
	 *
	 * Params: id
	 * Response 200: confirmación
	 * Response 404: manager no encontrado
	 */
	delete: async (req, res, next) => {
		try {
			const [result] = await Manager.delete(req.params.id);
			if (result.affectedRows === 0)
				return res.status(404).json({ message: "Manager not found" });
			res.json({ message: "Manager deleted successfully" });
		} catch (err) {
			next(err);
		}
	},
};

module.exports = managerController;
