/**
 * @module roleMiddleware
 * Middleware de autorización por rol.
 * Debe usarse siempre después de `authMiddleware`, que es quien inyecta `req.user`.
 * Acepta uno o varios roles permitidos y deniega el acceso si el usuario no los cumple.
 *
 * Uso: roleMiddleware("admin", "manager")
 * Errores:
 *   403 → El rol del usuario no está entre los permitidos
 */
/**
 * Crea un middleware que permite el acceso solo a los roles indicados.
 *
 * @param {...string} roles Roles permitidos.
 * @returns {import('express').RequestHandler} Middleware de autorización.
 */
const roleMiddleware =
	(...roles) =>
	(req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	};

module.exports = roleMiddleware;
