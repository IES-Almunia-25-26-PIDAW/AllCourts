/**
 * @module errorHandler
 * Middleware global de manejo de errores.
 * Debe registrarse al final de la cadena de middlewares en app.js.
 * Captura cualquier error pasado mediante `next(err)` y devuelve
 * una respuesta JSON normalizada.
 *
 * Respuesta: { message } con el status del error o 500 por defecto.
 */
/**
 * Convierte cualquier error en una respuesta JSON con código HTTP coherente.
 *
 * @param {Error & {status?: number}} err Error capturado.
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	const status = err.status || 500;
	res.status(status).json({
		message: err.message || "Internal Server Error",
	});
};

module.exports = errorHandler;
