//#region MODULES
const express = require("express");
const courtController = require("../controllers/courtController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module courtRouter
 * Rutas de pistas.
 *
 * GET    /courts               → Listar todas las pistas
 * GET    /courts/city/:city    → Listar pistas por ciudad
 * GET    /courts/club/:clubId  → Listar pistas de un club
 * GET    /courts/:id           → Detalle de una pista
 * POST   /courts               → Crear una pista (solo gestores)
 * PUT    /courts/:id           → Actualizar una pista (solo gestores)
 * DELETE /courts/:id           → Eliminar una pista (solo gestores)
 */
const router = express.Router();

router.get("/", courtController.getAll);
router.get("/city/:city", courtController.getByCity);
router.get("/club/:clubId", courtController.getByClubId);
router.get("/:id", courtController.getById);
router.post("/", authMiddleware, roleMiddleware("manager"), courtController.create);
router.put("/:id", authMiddleware, roleMiddleware("manager"), courtController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), courtController.delete);

module.exports = router;
