const rateLimit = require("express-rate-limit");

/**
 * Limiter para proteger el endpoint de login frente a fuerza bruta.
 */
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many login attempts. Please try again in 15 minutes.",
	},
});

/**
 * Limiter para proteger el registro de cuentas frente a abusos.
 */
const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message:
			"Too many registration attempts from this IP. Please try again in 1 hour.",
	},
});

/**
 * Limiter para solicitudes de recuperación de contraseña.
 */
const forgotPasswordLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message:
			"Too many password recovery requests. Please try again in 1 hour.",
	},
});

module.exports = { loginLimiter, registerLimiter, forgotPasswordLimiter };
