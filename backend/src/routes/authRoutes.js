//#region MODULES
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
//#endregion

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

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);
router.get('/verify/:token', authController.verifyEmail);
router.post('/refresh', authController.refresh);

module.exports = router;
