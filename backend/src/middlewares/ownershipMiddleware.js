const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Court = require("../models/Court");
const Club = require("../models/Club");
const Manager = require("../models/Manager");

/**
 * @module ownershipMiddleware
 * Middleware de autorización por propiedad y relación jerárquica.
 * Permite validar que un usuario, manager o propietario pueda acceder a reservas, pagos o pistas concretas.
 */

/**
 * Compara dos identificadores como texto para evitar problemas de tipo.
 *
 * @param {string|number} left Identificador izquierdo.
 * @param {string|number} right Identificador derecho.
 * @returns {boolean} `true` si ambos representan el mismo valor.
 */
function sameId(left, right) {
	return String(left) === String(right);
}

/**
 * Responde con un 403 estandarizado.
 *
 * @param {import('express').Response} res Respuesta HTTP.
 * @returns {import('express').Response} Respuesta de error.
 */
function forbidden(res) {
	return res.status(403).json({ message: "Forbidden" });
}

/**
 * Permite el acceso solo si el usuario coincide con el parámetro indicado.
 *
 * @param {string} paramName Nombre del parámetro de ruta.
 * @returns {import('express').RequestHandler} Middleware de autorización.
 */
function requireSameUserParam(paramName) {
	return (req, res, next) => {
		if (!sameId(req.user?.id, req.params[paramName])) {
			return forbidden(res);
		}

		next();
	};
}

/**
 * Verifica que el manager autenticado sea propietario del club indicado en la ruta.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requireManagerOwnClub(req, res, next) {
	try {
		const [clubRows] = await Club.getById(req.params.id);
		if (clubRows.length === 0) {
			return res.status(404).json({ message: "Club not found" });
		}

		if (!sameId(clubRows[0].manager_id, req.user?.id)) {
			return forbidden(res);
		}

		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Verifica que el manager autenticado sea propietario del club indicado en el body.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requireManagerOwnClubFromBody(req, res, next) {
	try {
		const clubId = req.body.club_id;
		const [clubRows] = await Club.getById(clubId);
		if (clubRows.length === 0) {
			return res.status(404).json({ message: "Club not found" });
		}

		if (!sameId(clubRows[0].manager_id, req.user?.id)) {
			return forbidden(res);
		}

		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Comprueba que el manager autenticado tenga suscripción activa.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requireActiveManagerSubscription(req, res, next) {
	try {
		const [managerRows] = await Manager.getById(req.user?.id);
		if (managerRows.length === 0) {
			return res.status(404).json({ message: "Manager not found" });
		}

		if (!managerRows[0].subscription_active) {
			return res
				.status(403)
				.json({ message: "Active subscription required" });
		}

		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Carga la reserva, su pista y su club asociados.
 *
 * @param {string|number} bookingId Identificador de la reserva.
 * @returns {Promise<{found: boolean, booking?: object, court?: object, club?: object}>} Contexto resuelto.
 */
async function loadBookingContext(bookingId) {
	const [bookingRows] = await Booking.getById(bookingId);
	if (bookingRows.length === 0) {
		return { found: false };
	}

	const booking = bookingRows[0];
	const [courtRows] = await Court.getById(booking.court_id);
	if (courtRows.length === 0) {
		return { found: false };
	}

	const court = courtRows[0];
	const [clubRows] = await Club.getById(court.club_id);
	if (clubRows.length === 0) {
		return { found: false };
	}

	return {
		found: true,
		booking,
		court,
		club: clubRows[0],
	};
}

/**
 * Determina si un usuario puede acceder al contexto de una reserva.
 *
 * @param {{booking: {user_id: string|number}, club: {manager_id: string|number}}} context Contexto de reserva.
 * @param {{id: string|number, role?: string}} user Usuario autenticado.
 * @returns {boolean} `true` si puede acceder.
 */
function canAccessBookingContext(context, user) {
	if (sameId(context.booking.user_id, user.id)) {
		return true;
	}

	if (user.role !== "manager") {
		return false;
	}

	return sameId(context.club.manager_id, user.id);
}

/**
 * Permite acceder a una reserva solo al propietario o al manager asociado.
 *
 * @param {string} paramName Nombre del parámetro de ruta que contiene el booking id.
 * @returns {import('express').RequestHandler} Middleware de autorización.
 */
function requireBookingAccessByParam(paramName) {
	return async (req, res, next) => {
		try {
			const bookingId = req.params[paramName];
			const context = await loadBookingContext(bookingId);
			if (!context.found) {
				return res.status(404).json({ message: "Booking not found" });
			}

			if (!canAccessBookingContext(context, req.user)) {
				return forbidden(res);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}

/**
 * Verifica que el manager autenticado sea propietario de la pista indicada.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requireManagerOwnCourt(req, res, next) {
	try {
		const courtId = req.params.id || req.params.courtId;
		const [courtRows] = await Court.getById(courtId);
		if (courtRows.length === 0) {
			return res.status(404).json({ message: "Court not found" });
		}

		const court = courtRows[0];
		const [clubRows] = await Club.getById(court.club_id);
		if (clubRows.length === 0) {
			return res.status(404).json({ message: "Club not found" });
		}

		if (!sameId(clubRows[0].manager_id, req.user?.id)) {
			return forbidden(res);
		}

		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Verifica que el manager autenticado sea propietario de la pista indicada en el body.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requireManagerOwnCourtFromBody(req, res, next) {
	try {
		const courtId = req.body.court_id;
		const [courtRows] = await Court.getById(courtId);
		if (courtRows.length === 0) {
			return res.status(404).json({ message: "Court not found" });
		}

		const court = courtRows[0];
		const [clubRows] = await Club.getById(court.club_id);
		if (clubRows.length === 0) {
			return res.status(404).json({ message: "Club not found" });
		}

		if (!sameId(clubRows[0].manager_id, req.user?.id)) {
			return forbidden(res);
		}

		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Permite acceder a un pago solo al propietario de la reserva o al manager del club.
 *
 * @param {string} paramName Nombre del parámetro de ruta.
 * @param {"payment"|"booking"} [lookupType="payment"] Tipo de búsqueda a usar.
 * @returns {import('express').RequestHandler} Middleware de autorización.
 */
function requirePaymentAccessByParam(paramName, lookupType = "payment") {
	return async (req, res, next) => {
		try {
			let context;

			if (lookupType === "payment") {
				const paymentId = req.params[paramName];
				const [paymentRows] = await Payment.getById(paymentId);
				if (paymentRows.length === 0) {
					return res
						.status(404)
						.json({ message: "Payment not found" });
				}
				const payment = paymentRows[0];
				context = await loadBookingContext(payment.booking_id);
			} else if (lookupType === "booking") {
				const bookingId = req.params[paramName];
				context = await loadBookingContext(bookingId);
			}

			if (!context.found) {
				return res.status(404).json({ message: "Booking not found" });
			}

			if (!canAccessBookingContext(context, req.user)) {
				return forbidden(res);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}

/**
 * Permite crear un pago solo si el usuario puede acceder a la reserva asociada.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
async function requirePaymentCreateAccess(req, res, next) {
	try {
		const context = await loadBookingContext(req.body.booking_id);
		if (!context.found) {
			return res.status(404).json({ message: "Booking not found" });
		}

		if (!canAccessBookingContext(context, req.user)) {
			return forbidden(res);
		}

		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	requireSameUserParam,
	requireManagerOwnClub,
	requireManagerOwnClubFromBody,
	requireActiveManagerSubscription,
	requireBookingAccessByParam,
	requireManagerOwnCourt,
	requireManagerOwnCourtFromBody,
	requirePaymentAccessByParam,
	requirePaymentCreateAccess,
};
