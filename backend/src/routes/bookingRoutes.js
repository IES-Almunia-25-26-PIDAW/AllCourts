//#region MODULES
const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module bookingRouter
 * Rutas de reservas.
 *
 * POST   /bookings                → Crear una reserva (requiere token)
 * GET    /bookings                → Listar todas las reservas (solo gestores)
 * GET    /bookings/user/:userId   → Reservas de un usuario autenticado
 * GET    /bookings/court/:courtId → Reservas de una pista (solo gestores)
 * GET    /bookings/:id            → Detalle de una reserva
 * PATCH  /bookings/:id/status     → Actualizar estado de una reserva (solo gestores)
 * PATCH  /bookings/:id/cancel     → Cancelar una reserva
 * DELETE /bookings/:id            → Eliminar una reserva (solo gestores)
 */
const router = express.Router();

router.post("/", authMiddleware, bookingController.create);
router.get("/", authMiddleware, roleMiddleware("manager"), bookingController.getAll);
router.get("/user/:userId", authMiddleware, bookingController.getByUserId);
router.get("/court/:courtId", authMiddleware, roleMiddleware("manager"), bookingController.getByCourtId);
router.get("/:id", authMiddleware, bookingController.getById);
router.patch("/:id/status", authMiddleware, roleMiddleware("manager"), bookingController.updateStatus);
router.patch("/:id/cancel", authMiddleware, bookingController.cancel);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), bookingController.delete);

module.exports = router;
