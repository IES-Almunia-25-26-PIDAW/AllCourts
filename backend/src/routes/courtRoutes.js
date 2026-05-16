const express = require("express");
const { body } = require("express-validator");
const courtController = require("../controllers/courtController");
const authMiddleware = require("../middlewares/authMiddleware");
const handleValidation = require("../middlewares/handleValidation");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
	requireManagerOwnCourt,
	requireManagerOwnClubFromBody,
	requireActiveManagerSubscription,
} = require("../middlewares/ownershipMiddleware");
const { uploadCourt } = require("../middlewares/uploadMiddleware");

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

/**
 * Devuelve la respuesta estándar de subida de imagen para pistas.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
function sendCourtUploadResponse(req, res) {
	if (!req.file) return res.status(400).json({ message: "No file uploaded" });
	const url = "/uploads/courts/" + req.file.filename;
	const fullUrl = `${req.protocol}://${req.get("host")}${url}`;
	res.json({ url, fullUrl });
}

const surfaceTypes = [
	"tierra_batida",
	"cesped_natural",
	"cesped_artificial",
	"dura",
	"arena",
	"parque",
];
const sports = [
	"tenis",
	"padel",
	"pickleball",
	"baloncesto_3x3",
	"baloncesto_5x5",
	"futbol_5",
	"futbol_7",
	"futbol_11",
	"voley",
	"balonmano",
];

const courtBodyValidators = [
	body("name")
		.notEmpty()
		.withMessage("El nombre es obligatorio")
		.trim()
		.isLength({ max: 150 })
		.withMessage("El nombre no puede superar 150 caracteres"),
	body("surface_type")
		.notEmpty()
		.withMessage("El tipo de superficie es obligatorio")
		.isIn(surfaceTypes)
		.withMessage("El tipo de superficie no es válido"),
	body("sport")
		.notEmpty()
		.withMessage("El deporte es obligatorio")
		.isIn(sports)
		.withMessage("El deporte no es válido"),
	body("price_60")
		.notEmpty()
		.withMessage("El precio de 60 minutos es obligatorio")
		.isFloat({ min: 0 })
		.withMessage("El precio de 60 minutos no es válido"),
	body("price_90")
		.notEmpty()
		.withMessage("El precio de 90 minutos es obligatorio")
		.isFloat({ min: 0 })
		.withMessage("El precio de 90 minutos no es válido"),
	body("price_120")
		.notEmpty()
		.withMessage("El precio de 120 minutos es obligatorio")
		.isFloat({ min: 0 })
		.withMessage("El precio de 120 minutos no es válido"),
	body("min_unit_min")
		.optional()
		.isInt({ min: 15, max: 120 })
		.withMessage("La unidad mínima debe estar entre 15 y 120 minutos"),
	body("is_indoor")
		.optional()
		.isBoolean()
		.withMessage("El campo is_indoor debe ser booleano"),
	body("description")
		.optional({ nullable: true })
		.isLength({ max: 1000 })
		.withMessage("La descripción no puede superar 1000 caracteres"),
];

router.get("/", courtController.getAll);
router.get("/city/:city", courtController.getByCity);
router.get("/club/:clubId", courtController.getByClubId);
router.get("/:id", courtController.getById);
router.post(
	"/",
	authMiddleware,
	roleMiddleware("manager"),
	requireActiveManagerSubscription,
	requireManagerOwnClubFromBody,
	body("club_id")
		.notEmpty()
		.withMessage("El club es obligatorio")
		.isInt({ min: 1 })
		.withMessage("El club debe ser un identificador válido"),
	...courtBodyValidators,
	handleValidation,
	courtController.create,
);
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware("manager"),
	requireActiveManagerSubscription,
	requireManagerOwnCourt,
	...courtBodyValidators,
	handleValidation,
	courtController.update,
);
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware("manager"),
	requireActiveManagerSubscription,
	requireManagerOwnCourt,
	courtController.delete,
);

router.post(
	"/upload",
	authMiddleware,
	roleMiddleware("manager"),
	uploadCourt.single("image"),
	sendCourtUploadResponse,
);

module.exports = router;
