//#region MODULES
const express = require("express");
const { body } = require("express-validator");
const clubController = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authMiddleware");
const handleValidation = require("../middlewares/handleValidation");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { requireManagerOwnClub, requireActiveManagerSubscription } = require("../middlewares/ownershipMiddleware");
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

const clubBodyValidators = [
	body('name').notEmpty().withMessage('El nombre es obligatorio').trim().isLength({ max: 150 }).withMessage('El nombre no puede superar 150 caracteres'),
	body('address').optional({ nullable: true }).trim().isLength({ max: 255 }).withMessage('La dirección no puede superar 255 caracteres'),
	body('city').optional({ nullable: true }).trim().isLength({ max: 100 }).withMessage('La ciudad no puede superar 100 caracteres'),
	body('description').optional({ nullable: true }).isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres'),
];

router.get("/", clubController.getAll);
router.get("/city/:city", clubController.getByCity);
router.get("/manager/:managerId", clubController.getByManagerId);
router.get("/:id", clubController.getById);
router.post("/", authMiddleware, roleMiddleware("manager"), requireActiveManagerSubscription, ...clubBodyValidators, handleValidation, clubController.create);
router.put("/:id", authMiddleware, roleMiddleware("manager"), requireManagerOwnClub, ...clubBodyValidators, handleValidation, clubController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), requireManagerOwnClub, clubController.delete);

module.exports = router;
