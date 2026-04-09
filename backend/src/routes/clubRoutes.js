//#region MODULES
const express = require("express");
const clubController = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module clubRouter
 * Rutas de clubes.
 *
 * GET    /clubs                    → Listar todos los clubes
 * GET    /clubs/city/:city         → Listar clubes por ciudad
 * GET    /clubs/manager/:managerId → Listar clubes de un gestor
 * GET    /clubs/:id                → Detalle de un club
 * POST   /clubs                    → Crear un club (solo gestores)
 * PUT    /clubs/:id                → Actualizar un club (solo gestores)
 * DELETE /clubs/:id                → Eliminar un club (solo gestores)
 */
const router = express.Router();

router.get("/", clubController.getAll);
router.get("/city/:city", clubController.getByCity);
router.get("/manager/:managerId", clubController.getByManagerId);
router.get("/:id", clubController.getById);
router.post("/", authMiddleware, roleMiddleware("manager"), clubController.create);
router.put("/:id", authMiddleware, roleMiddleware("manager"), clubController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), clubController.delete);

module.exports = router;
