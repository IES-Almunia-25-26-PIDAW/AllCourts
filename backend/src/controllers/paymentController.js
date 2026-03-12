const Payment = require("../models/Payment");

/**
 * @module paymentController
 * Controlador de pagos.
 * Cada reserva puede tener un pago asociado (relación 1:1 ya que booking_id es UNIQUE).
 * El flujo habitual es: crear reserva → crear pago con status='pending' →
 * actualizar a 'success' o 'failed' tras procesar con la pasarela de pago.
 *
 * Rutas esperadas:
 *   POST   /payments                           → create
 *   GET    /payments                           → getAll          (p.ej. solo admin)
 *   GET    /payments/:id                       → getById
 *   GET    /payments/booking/:bookingId        → getByBookingId
 *   GET    /payments/user/:userId             → getByUserId
 *   GET    /payments/manager/:managerId       → getByManagerId
 *   PATCH  /payments/:id/status              → updateStatus
 *   DELETE /payments/:id                       → delete
 */
const paymentController = {
    /**
     * Crea un nuevo registro de pago vinculado a una reserva.
     * La reserva (booking_id) tiene restricción UNIQUE, por lo que solo
     * puede existir un pago por reserva.
     *
     * Body: { booking_id, amount, payment_date?, status?, method? }
     * status: 'pending' | 'success' | 'failed'  (default: 'pending')
     * method: p.ej. 'card', 'paypal', 'transfer'
     * Response 201: { message, id }
     */
    create: async (req, res, next) => {
        try {
            const { booking_id, amount, payment_date, status, method } = req.body;
            const [result] = await Payment.create({
                booking_id,
                amount,
                payment_date: payment_date || null, // Si no se indica, la BD usa CURRENT_TIMESTAMP
                status,
                method,
            });
            res.status(201).json({
                message: "Payment created successfully",
                id: result.insertId,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todos los pagos con datos de reserva, usuario y pista (JOIN).
     * Ordenados por payment_date descendente.
     *
     * Response 200: array de pagos
     */
    getAll: async (req, res, next) => {
        try {
            const [rows] = await Payment.getAll();
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve un pago por su ID con datos completos de reserva, usuario y pista.
     *
     * Params: id
     * Response 200: objeto pago
     * Response 404: pago no encontrado
     */
    getById: async (req, res, next) => {
        try {
            const [rows] = await Payment.getById(req.params.id);
            if (rows.length === 0)
                return res.status(404).json({ message: "Payment not found" });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve el pago asociado a una reserva concreta.
     * Como booking_id es UNIQUE devuelve como máximo un resultado.
     *
     * Params: bookingId
     * Response 200: objeto pago
     * Response 404: pago no encontrado para esa reserva
     */
    getByBookingId: async (req, res, next) => {
        try {
            const [rows] = await Payment.getByBookingId(req.params.bookingId);
            if (rows.length === 0)
                return res.status(404).json({ message: "Payment not found" });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todos los pagos realizados por un usuario (via sus reservas).
     *
     * Params: userId
     * Response 200: array de pagos (puede ser vacío)
     */
    getByUserId: async (req, res, next) => {
        try {
            const [rows] = await Payment.getByUserId(req.params.userId);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todos los pagos recibidos por un manager (de sus pistas).
     * Hace JOIN: payments → bookings → courts → clubs WHERE clubs.manager_id = ?
     *
     * Params: managerId
     * Response 200: array de pagos (puede ser vacío)
     */
    getByManagerId: async (req, res, next) => {
        try {
            const [rows] = await Payment.getByManagerId(req.params.managerId);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Actualiza el estado de un pago.
     * Se usa tras recibir confirmación o rechazo de la pasarela de pago.
     * Estados posibles: 'pending' | 'success' | 'failed'
     *
     * Params: id
     * Body: { status }
     * Response 200: confirmación
     * Response 404: pago no encontrado
     */
    updateStatus: async (req, res, next) => {
        try {
            const { status } = req.body;
            const [result] = await Payment.updateStatus(req.params.id, status);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Payment not found" });
            res.json({ message: "Payment status updated successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Elimina un pago de la BD.
     * Usar con precaución; normalmente es preferible actualizar el estado a 'failed'.
     *
     * Params: id
     * Response 200: confirmación
     * Response 404: pago no encontrado
     */
    delete: async (req, res, next) => {
        try {
            const [result] = await Payment.delete(req.params.id);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Payment not found" });
            res.json({ message: "Payment deleted successfully" });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = paymentController;
