//#region MODULES
const express = require("express");
const managerController = require("../controllers/managerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { requireSameUserParam } = require("../middlewares/ownershipMiddleware");
//#endregion

/**
 * @module managerRouter
 * Rutas de gestores.
 *
 * GET    /managers                  → Listar gestores (solo gestores)
 * GET    /managers/user/:userId     → Obtener gestor por usuario
 * GET    /managers/:id/courts       → Pistas asociadas a un gestor
 * GET    /managers/:id/stats        → Estadísticas de un gestor
 * GET    /managers/:id              → Detalle de un gestor
 * PATCH  /managers/:id/subscription → Actualizar suscripción de un gestor
 * DELETE /managers/:id              → Eliminar un gestor (solo gestores)
 */
const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), managerController.getAll);
router.get("/user/:userId", authMiddleware, requireSameUserParam("userId"), managerController.getByUserId);
router.get("/:id/courts", authMiddleware, roleMiddleware("manager"), requireSameUserParam("id"), managerController.getCourts);
router.get("/:id/stats", authMiddleware, roleMiddleware("manager"), requireSameUserParam("id"), managerController.getStats);
router.get("/:id", authMiddleware, roleMiddleware("manager"), requireSameUserParam("id"), managerController.getById);
router.patch("/:id/subscription", authMiddleware, roleMiddleware("manager"), requireSameUserParam("id"), managerController.updateSubscription);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), requireSameUserParam("id"), managerController.delete);

module.exports = router;
