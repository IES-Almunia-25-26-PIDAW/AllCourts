//#region MODULES
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
//#endregion

/**
 * @module authRouter
 * Rutas de autenticación.
 *
 * POST  /auth/register        → Registro de nuevo usuario
 * POST  /auth/login           → Login con email y contraseña
 * GET   /auth/me              → Perfil del usuario autenticado (requiere token)
 * GET   /auth/verify/:token   → Verificación de email
 */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);
router.get("/verify/:token", authController.verifyEmail);

module.exports = router;
