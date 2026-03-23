//#region MODULES
const jwt = require("jsonwebtoken");
//#endregion

/**
 * @module authMiddleware
 * Middleware de autenticación JWT.
 * Verifica el token Bearer del header `Authorization` e inyecta
 * el payload decodificado en `req.user` para uso en controladores.
 *
 * Errores:
 *   401 → Token ausente, inválido o expirado. 
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
