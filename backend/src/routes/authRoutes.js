const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const handleValidation = require("../middlewares/handleValidation");
const {
	loginLimiter,
	registerLimiter,
	forgotPasswordLimiter,
} = require("../middlewares/rateLimiter");

/**
 * @module authRouter
 * Rutas de autenticación.
 *
 * POST  /auth/register       → Registro de nuevo usuario
 * POST  /auth/login          → Login con email y contraseña
 * GET   /auth/me             → Perfil del usuario autenticado (requiere token)
 * GET   /auth/verify/:token  → Verificación de email
 * POST  /auth/refresh        → Refresco de la sesión
 */
const router = express.Router();

router.post(
	"/register",
	registerLimiter,
	body("name")
		.notEmpty()
		.withMessage("El nombre es obligatorio")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("El nombre debe tener entre 2 y 100 caracteres"),
	body("username")
		.notEmpty()
		.withMessage("El nombre de usuario es obligatorio")
		.trim()
		.isLength({ min: 3, max: 30 })
		.withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres"),
	body("email")
		.isEmail()
		.withMessage("El email no es válido")
		.normalizeEmail(),
	body("password")
		.notEmpty()
		.withMessage("La contraseña es obligatoria")
		.isLength({ min: 8, max: 128 })
		.withMessage(
			"La contraseña debe tener al menos 8 caracteres y como máximo 128",
		),
	body("role")
		.optional()
		.isIn(["player", "manager"])
		.withMessage("El rol no es válido"),
	handleValidation,
	authController.register,
);
router.post(
	"/login",
	loginLimiter,
	body("identifier")
		.notEmpty()
		.withMessage("El identificador es obligatorio")
		.trim(),
	body("password").notEmpty().withMessage("La contraseña es obligatoria"),
	handleValidation,
	authController.login,
);
router.post(
	"/forgot-password",
	forgotPasswordLimiter,
	body("email")
		.isEmail()
		.withMessage("El email no es válido")
		.normalizeEmail(),
	handleValidation,
	authController.forgotPassword,
);
router.post(
	"/reset-password/:token",
	body("newPassword")
		.notEmpty()
		.withMessage("La nueva contraseña es obligatoria")
		.isLength({ min: 8, max: 128 })
		.withMessage(
			"La nueva contraseña debe tener al menos 8 caracteres y como máximo 128",
		),
	handleValidation,
	authController.resetPassword,
);
router.post(
	"/resend-verification",
	body("email")
		.isEmail()
		.withMessage("El email no es válido")
		.normalizeEmail(),
	handleValidation,
	authController.resendVerification,
);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);
router.get("/verify/:token", authController.verifyEmail);
router.post("/refresh", authController.refresh);

module.exports = router;
