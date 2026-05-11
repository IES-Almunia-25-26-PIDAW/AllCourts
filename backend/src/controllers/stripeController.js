const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");
const emailService = require("../services/emailService");

/**
 * @module stripeController
 *
 * Controlador que contiene DOS acciones principales relacionadas con Stripe:
 *
 *  1. createPaymentIntent → El frontend pide un "intento de pago" (PaymentIntent).
 *     Stripe nos devuelve un clientSecret que enviamos al frontend para que
 *     Stripe Elements pueda cobrar directamente sin que los datos de la tarjeta
 *     pasen por nuestro servidor.
 *
 *  2. webhook → Stripe nos notifica por HTTP cuando ocurre algo
 *     (pago completado, fallido…). Aquí actualizamos el estado de la reserva y
 *     del pago en nuestra base de datos.
 */

const stripeController = {
	/**
	 * Crea un PaymentIntent de Stripe para una reserva existente.
	 *
	 * ¿Qué es un PaymentIntent?
	 *   Es un objeto de Stripe que representa la intención de cobrar una cantidad.
	 *   Stripe lo usa para gestionar el ciclo de vida del pago: creado → procesando
	 *   → completado / fallido. Nos devuelve un `clientSecret` que entregamos al
	 *   frontend para que Stripe Elements pueda autenticar y confirmar el pago
	 *   sin que los datos sensibles de tarjeta pasen por nuestro servidor.
	 *
	 * Body esperado: { bookingId }
	 *
	 * Respuesta 200: { clientSecret, paymentIntentId, amount }
	 * Respuesta 400: si la reserva no existe, ya está pagada, o falta bookingId
	 */
	createPaymentIntent: async (req, res, next) => {
		try {
			const { bookingId } = req.body;

			// Validamos que el cliente nos envíe el ID de la reserva.
			if (!bookingId) {
				return res
					.status(400)
					.json({ message: "bookingId is required" });
			}

			// Buscamos la reserva en la BD para obtener el precio total.
			// Si no existe, devolvemos 404.
			const [bookingRows] = await Booking.getById(bookingId);
			if (!bookingRows.length) {
				return res.status(404).json({ message: "Booking not found" });
			}

			const booking = bookingRows[0];

			// Comprobamos que la reserva no esté ya pagada o cancelada.
			// No tiene sentido crear un PaymentIntent para una reserva cancelada.
			if (booking.status === "confirmed") {
				return res
					.status(400)
					.json({ message: "Booking is already paid" });
			}
			if (booking.status === "cancelled") {
				return res
					.status(400)
					.json({ message: "Booking is cancelled" });
			}

			// Stripe trabaja en céntimos, no en decimales.
			// Multiplicamos el precio por 100 y redondeamos para evitar errores de coma flotante.
			const amountInCents = Math.round(
				parseFloat(booking.total_price) * 100,
			);

			// Creamos el PaymentIntent en Stripe.
			// - amount: cantidad en céntimos
			// - currency: "eur" porque trabajamos en euros
			// - metadata: datos extras que Stripe guarda y que recibiremos en el webhook.
			// - automatic_payment_methods: Stripe detecta automáticamente los métodos
			//   disponibles (tarjeta, Bizum, etc.) sin que tengamos que configurar nada.
			const paymentIntent = await stripe.paymentIntents.create({
				amount: amountInCents,
				currency: "eur",
				metadata: {
					bookingId: String(bookingId),
					userId: String(booking.user_id),
					courtName: booking.court_name || "",
				},
				automatic_payment_methods: {
					enabled: true,
				},
			});

			// Respondemos al frontend con el clientSecret.
			// El clientSecret es el único dato que necesita Stripe Elements para cobrar.
			// NUNCA debemos compartir la clave secreta completa con el frontend.
			res.json({
				clientSecret: paymentIntent.client_secret,
				paymentIntentId: paymentIntent.id,
				amount: amountInCents,
			});
		} catch (err) {
			next(err);
		}
	},

	/**
	 * Webhook: recibe eventos de Stripe cuando algo pasa con un pago.
	 *
	 * ¿Cómo funciona un webhook?
	 *   Cuando Stripe completa (o falla) un pago, envía una petición POST a
	 *   nuestra URL /stripe/webhook con un JSON que describe el evento.
	 *   Para garantizar que la petición viene realmente de Stripe,
     *   verificamos la firma usando STRIPE_WEBHOOK_SECRET.
	 *
	 * IMPORTANTE: Esta ruta NO puede usar express.json() porque necesita el
	 *   body en RAW (Buffer), no parseado. Por eso en app.js la registramos
	 *   ANTES del middleware express.json() con express.raw().
	 *
	 * Eventos que manejamos:
	 *   - payment_intent.succeeded  → pago completado → reserva "confirmed" + pago "success"
	 *   - payment_intent.payment_failed → pago fallido → pago "failed"
	 */
	webhook: async (req, res) => {
		// Leemos la firma que Stripe incluye en el header de la petición.
		const sig = req.headers["stripe-signature"];
		let event;

		try {
			// constructEvent verifica criptográficamente que la petición viene de Stripe.
			// Si la firma no coincide, lanza un error y evitamos procesar datos falsos.
			event = stripe.webhooks.constructEvent(
				req.body, 
				sig, // Firma del header
				process.env.STRIPE_WEBHOOK_SECRET, 
			);
		} catch (err) {
			// Si la verificación falla, rechazamos la petición con 400.
			console.error(
				"Webhook signature verification failed:",
				err.message,
			);
			return res
				.status(400)
				.json({ message: `Webhook Error: ${err.message}` });
		}

		// Procesamos el evento según su tipo.
		// Usamos un switch para manejar distintos tipos de eventos de Stripe.
		try {
			switch (event.type) {
				// Pago completado → actualizamos el estado de la reserva y del pago en nuestra BD.
				case "payment_intent.succeeded": {
					const paymentIntent = event.data.object;

					// Recuperamos el bookingId que guardamos en los metadatos al crear el PaymentIntent.
					const bookingId = paymentIntent.metadata?.bookingId;

					if (!bookingId) {
						console.warn(
							"Webhook: paymentIntent without bookingId in metadata",
						);
						break;
					}

					// IDEMPOTENCIA: antes de actualizar, comprobamos si ya existe un pago
					// para esta reserva con status "success". Si ya existe, no hacemos nada.
					// Esto evita duplicados si Stripe envía el evento más de una vez.
					const [existingPayments] =
						await Payment.getByBookingId(bookingId);
					const alreadyPaid = existingPayments.some(
						(p) => p.status === "success",
					);

					if (alreadyPaid) {
						console.log(
							`Webhook: booking ${bookingId} already paid, skipping`,
						);
						break;
					}

					// Actualizamos el estado de la reserva a "confirmed" (pagada).
					await Booking.updateStatus(bookingId, "confirmed");

					// Buscamos si ya hay un registro de pago en "pending" para esta reserva.
					// Si existe, lo actualizamos. Si no, lo creamos.
					if (existingPayments.length > 0) {
						// Ya existe un pago pendiente → actualizamos su estado a "success".
						await Payment.updateStatus(
							existingPayments[0].id,
							"success",
						);
					} else {
						// No existe ningún pago → creamos uno nuevo con todos los datos.
						await Payment.create({
							booking_id: bookingId,
							amount: paymentIntent.amount / 100, 
							status: "success",
							method: "card", // Stripe Elements usa tarjeta por defecto
							stripe_payment_intent_id: paymentIntent.id,
						});
					}

					try {
						const [bookingRows] = await Booking.getById(bookingId);
						if (!bookingRows.length) {
							console.warn(
								`Webhook: booking ${bookingId} not found for email`,
							);
							break;
						}

						const booking = bookingRows[0];
						let user = {
							name: booking.user_name,
							email: booking.user_email,
						};

						if (!user.email) {
							const [userRows] = await User.getById(booking.user_id);
							if (!userRows.length) {
								console.warn(
									`Webhook: user ${booking.user_id} not found for email`,
								);
								break;
							}
							user = userRows[0];
						}

						await emailService.sendBookingConfirmationEmail(user, booking);
					} catch (emailError) {
						console.error(
							"Webhook: failed to send booking confirmation email:",
							emailError,
						);
					}

					console.log(
						`Webhook: booking ${bookingId} confirmed after payment ${paymentIntent.id}`,
					);
					break;
				}

				// PAGO FALLIDO
				case "payment_intent.payment_failed": {
					const paymentIntent = event.data.object;
					const bookingId = paymentIntent.metadata?.bookingId;

					if (!bookingId) break;

					// Si existe un pago pendiente para esta reserva, lo marcamos como fallido.
					const [existingPayments] =
						await Payment.getByBookingId(bookingId);
					if (existingPayments.length > 0) {
						await Payment.updateStatus(
							existingPayments[0].id,
							"failed",
						);
					}

					console.log(
						`Webhook: payment failed for booking ${bookingId}`,
					);
					break;
				}

				default:
					console.log(`Webhook: unhandled event type ${event.type}`);
			}
		} catch (err) {
			// Si hay un error procesando el evento, lo logueamos pero respondemos 200
			// para que Stripe no reintente el evento indefinidamente.
			console.error("Webhook processing error:", err);
		}

		// Siempre respondemos 200 a Stripe para confirmar que recibimos el evento.
		// Si respondemos cualquier otro código, Stripe reintentará el envío.
		res.json({ received: true });
	},
};

module.exports = stripeController;
