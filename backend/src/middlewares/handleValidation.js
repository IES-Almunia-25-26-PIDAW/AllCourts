const { validationResult } = require("express-validator");

/**
 * Responde con 422 cuando express-validator detecta errores en la petición.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
function handleValidation(req, res, next) {
	const result = validationResult(req);

	if (result.isEmpty()) {
		return next();
	}

	return res.status(422).json({
		errors: result.array().map((err) => ({
			field: err.path,
			message: err.msg,
		})),
	});
}

module.exports = handleValidation;
