const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration attempts from this IP. Please try again in 1 hour.'
  }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password recovery requests. Please try again in 1 hour.'
  }
});

module.exports = { loginLimiter, registerLimiter, forgotPasswordLimiter };
