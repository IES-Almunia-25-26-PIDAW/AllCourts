//#region MODULES
const express = require("express");
const courtScheduleController = require("../controllers/courtScheduleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module courtScheduleRouter
 * Rutas de horarios de pista.
 *
 * POST   /court-schedules/bulk                   → Crear o actualizar horarios en bloque (solo gestores)
 * POST   /court-schedules                        → Crear o actualizar un horario (solo gestores)
 * GET    /court-schedules/court/:courtId         → Horarios de una pista
 * GET    /court-schedules/court/:courtId/day/:dayOfWeek → Horario por día de una pista
 * PUT    /court-schedules/:id                    → Actualizar un horario (solo gestores)
 * DELETE /court-schedules/:id                    → Eliminar un horario (solo gestores)
 * DELETE /court-schedules/court/:courtId         → Eliminar todos los horarios de una pista (solo gestores)
 */
const router = express.Router();

router.post("/bulk", authMiddleware, roleMiddleware("manager"), courtScheduleController.upsertBulk);
router.post("/", authMiddleware, roleMiddleware("manager"), courtScheduleController.upsert);
router.get("/court/:courtId", courtScheduleController.getByCourtId);
router.get("/court/:courtId/day/:dayOfWeek", courtScheduleController.getByCourtAndDay);
router.put("/:id", authMiddleware, roleMiddleware("manager"), courtScheduleController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), courtScheduleController.delete);
router.delete("/court/:courtId", authMiddleware, roleMiddleware("manager"), courtScheduleController.deleteByCourtId);

module.exports = router;
