const jwt = require("jsonwebtoken");

/**
 * @module authMiddleware
 * Middleware de autenticación JWT.
 * Verifica el token Bearer del header `Authorization` e inyecta
 * el payload decodificado en `req.user` para uso en controladores.
 *
 * Errores:
 *   401 → Token ausente, inválido o expirado.
 */
/**
 * Verifica un JWT recibido por header `Authorization` o por cookie.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	let token = null;

	if (authHeader && authHeader.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	} else if (req.cookies && req.cookies.allcourts_token) {
		token = req.cookies.allcourts_token;
	}

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

module.exports = authMiddleware;
