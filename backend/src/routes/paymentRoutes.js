//#region MODULES
const express = require("express");
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module paymentRouter
 * Rutas de pagos.
 *
 * GET    /payments                    → Listar todos los pagos (solo gestores)
 * GET    /payments/booking/:bookingId → Pagos de una reserva
 * GET    /payments/user/:userId       → Pagos de un usuario
 * GET    /payments/manager/:managerId → Pagos de un gestor (solo gestores)
 * GET    /payments/:id                → Detalle de un pago
 * POST   /payments                    → Crear un pago
 * PATCH  /payments/:id/status         → Actualizar estado de un pago (solo gestores)
 * DELETE /payments/:id                → Eliminar un pago (solo gestores)
 */
const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), paymentController.getAll);
router.get("/booking/:bookingId", authMiddleware, paymentController.getByBookingId);
router.get("/user/:userId", authMiddleware, paymentController.getByUserId);
router.get("/manager/:managerId", authMiddleware, roleMiddleware("manager"), paymentController.getByManagerId);
router.get("/:id", authMiddleware, paymentController.getById);
router.post("/", authMiddleware, paymentController.create);
router.patch("/:id/status", authMiddleware, roleMiddleware("manager"), paymentController.updateStatus);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), paymentController.delete);

module.exports = router;
