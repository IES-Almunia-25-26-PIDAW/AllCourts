const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Manager = require("../models/Manager");
const User = require("../models/User");
const emailService = require("../services/emailService");

const SUBSCRIPTION_PRICE_FALLBACKS = {
	price_1TWNBYQtE3XYjvG19wczmxdH: {
		nickname: "Starter Plan",
		productName: "AllCourts Starter Plan",
		unitAmount: 2900,
	},
	price_1TWNENQtE3XYjvG16dKdqhDB: {
		nickname: "Professional Plan",
		productName: "AllCourts Professional Plan",
		unitAmount: 7900,
	},
	price_1TWNEDQtE3XYjvG1j81qxME5: {
		nickname: "Enterprise Plan",
		productName: "AllCourts Enterprise Plan",
		unitAmount: 19900,
	},
};

const ALLOWED_SUBSCRIPTION_STATUSES = new Set([
	"inactive",
	"incomplete",
	"active",
	"past_due",
	"canceled",
	"incomplete_expired",
	"trialing",
	"unpaid",
	"paused",
]);

/**
 * Normaliza el estado de una suscripción Stripe a un valor admitido por la BD.
 *
 * @param {string|undefined|null} status Estado original de Stripe.
 * @returns {string} Estado validado o `inactive` si no es reconocible.
 */
function normalizeSubscriptionStatus(status) {
	if (!status) {
		return "inactive";
	}

	return ALLOWED_SUBSCRIPTION_STATUSES.has(status) ? status : "inactive";
}

/**
 * Convierte los timestamps de Stripe en fechas legibles `YYYY-MM-DD`.
 *
 * @param {object} subscription Suscripción de Stripe.
 * @returns {{subscriptionStart: string|null, subscriptionEnd: string|null}} Periodo normalizado.
 */
function mapSubscriptionPeriod(subscription) {
	return {
		subscriptionStart: subscription.current_period_start
			? new Date(subscription.current_period_start * 1000)
					.toISOString()
					.slice(0, 10)
			: null,
		subscriptionEnd: subscription.current_period_end
			? new Date(subscription.current_period_end * 1000)
					.toISOString()
					.slice(0, 10)
			: null,
	};
}

/**
 * Resuelve el email asociado a una checkout session de Stripe.
 *
 * @param {object} session Checkout session de Stripe.
 * @returns {Promise<string|null>} Email del cliente o `null` si no puede obtenerse.
 */
async function resolveCheckoutSessionEmail(session) {
	const sessionEmail =
		session.customer_details?.email ||
		session.customer_email ||
		session.customer_details?.email_address ||
		null;

	if (sessionEmail) {
		return sessionEmail;
	}

	if (!session.customer) {
		return null;
	}

	const customer = await stripe.customers.retrieve(session.customer);
	return customer && !customer.deleted ? customer.email || null : null;
}

/**
 * Sincroniza el estado de suscripción de un manager con la información recibida de Stripe.
 *
 * @param {object} subscription Suscripción de Stripe.
 * @param {string|null} email Email del manager a localizar.
 * @returns {Promise<object|null>} Manager actualizado o `null` si no existe coincidencia.
 */
async function syncManagerFromStripeSubscription(subscription, email) {
	if (!email) {
		return null;
	}

	const [managerRows] = await Manager.getByEmail(email);
	if (!managerRows.length) {
		return null;
	}

	const manager = managerRows[0];
	const wasActive = Boolean(manager.subscription_active);
	const { subscriptionStart, subscriptionEnd } =
		mapSubscriptionPeriod(subscription);
	const status = normalizeSubscriptionStatus(subscription.status);
	const isActiveSubscription = status === "active" || status === "trialing";

	await Manager.updateSubscription(manager.id, {
		subscription_active: isActiveSubscription,
		subscription_start: subscriptionStart,
		subscription_end: subscriptionEnd,
	});

	await Manager.updateStripeSubscriptionData(manager.id, {
		stripeCustomerId: subscription.customer,
		stripeSubscriptionId: subscription.id,
		subscriptionStatus: status,
	});

	if (isActiveSubscription && !wasActive) {
		try {
			await emailService.sendSubscriptionActivationEmail(
				manager,
				subscription.items.data[0]?.price.nickname || "Manager",
				{
					subscription_start: subscriptionStart,
					subscription_end: subscriptionEnd,
				},
			);
		} catch (emailError) {
			console.error(
				"Webhook: failed to send subscription activation email:",
				emailError,
			);
		}
	}

	return manager;
}

/**
 * @module stripeController
 *
 * Controlador que agrupa los flujos de Stripe de la aplicación.
 *
 * 1. createPaymentIntent → pago de reservas.
 * 2. createSubscription/getSubscriptionStatus → suscripción de managers.
 * 3. webhook → confirmación asíncrona de Stripe.
 */

const stripeController = {
	createPaymentIntent: async (req, res, next) => {
		try {
			const { bookingId } = req.body;

			if (!bookingId) {
				return res
					.status(400)
					.json({ message: "bookingId is required" });
			}

			const [bookingRows] = await Booking.getById(bookingId);
			if (!bookingRows.length) {
				return res.status(404).json({ message: "Booking not found" });
			}

			const booking = bookingRows[0];

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

			const amountInCents = Math.round(
				parseFloat(booking.total_price) * 100,
			);

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

			res.json({
				clientSecret: paymentIntent.client_secret,
				paymentIntentId: paymentIntent.id,
				amount: amountInCents,
			});
		} catch (err) {
			next(err);
		}
	},

	createSubscription: async (req, res, next) => {
		try {
			const { priceId } = req.body;

			if (!priceId) {
				return res.status(400).json({ message: "priceId is required" });
			}

			const [managerRows] = await Manager.getById(req.user.id);
			if (!managerRows.length) {
				return res.status(404).json({ message: "Manager not found" });
			}

			const manager = managerRows[0];
			let stripeCustomerId = manager.stripe_customer_id;

			if (!stripeCustomerId) {
				const customer = await stripe.customers.create({
					email: manager.email,
					name: manager.name,
					metadata: {
						managerId: String(manager.id),
					},
				});

				stripeCustomerId = customer.id;
			}

			let resolvedPriceId = priceId;
			const fallbackPrice = SUBSCRIPTION_PRICE_FALLBACKS[priceId];

			if (fallbackPrice) {
				const createdPrice = await stripe.prices.create({
					currency: "eur",
					unit_amount: fallbackPrice.unitAmount,
					recurring: {
						interval: "month",
					},
					product_data: {
						name: fallbackPrice.productName,
					},
					nickname: fallbackPrice.nickname,
				});

				resolvedPriceId = createdPrice.id;
			}

			const subscription = await stripe.subscriptions.create({
				customer: stripeCustomerId,
				items: [{ price: resolvedPriceId }],
				payment_behavior: "default_incomplete",
				collection_method: "charge_automatically",
				expand: [
					"latest_invoice.payment_intent",
					"latest_invoice.confirmation_secret",
				],
			});

			let paymentIntent = subscription.latest_invoice?.payment_intent;
			let clientSecret =
				typeof paymentIntent === "object"
					? paymentIntent.client_secret
					: null;
			let invoice = subscription.latest_invoice || null;

			if (!paymentIntent || typeof paymentIntent === "string") {
				const invoiceId =
					typeof subscription.latest_invoice === "string"
						? subscription.latest_invoice
						: subscription.latest_invoice?.id;

				if (invoiceId) {
					const retrievedInvoice = await stripe.invoices.retrieve(
						invoiceId,
						{
							expand: ["payment_intent", "confirmation_secret"],
						},
					);
					invoice = retrievedInvoice;
					paymentIntent = retrievedInvoice.payment_intent;
					clientSecret =
						retrievedInvoice.payment_intent?.client_secret ||
						retrievedInvoice.confirmation_secret?.client_secret ||
						clientSecret;

					if (!clientSecret && retrievedInvoice.status === "draft") {
						const finalizedInvoice =
							await stripe.invoices.finalizeInvoice(invoiceId, {
								expand: [
									"payment_intent",
									"confirmation_secret",
								],
							});
						invoice = finalizedInvoice;
						paymentIntent = finalizedInvoice.payment_intent;
						clientSecret =
							finalizedInvoice.payment_intent?.client_secret ||
							finalizedInvoice.confirmation_secret
								?.client_secret ||
							clientSecret;
					}
				}
			}

			if (!clientSecret) {
				console.error("Stripe subscription missing payment intent:", {
					subscriptionId: subscription.id,
					subscriptionStatus: subscription.status,
					latestInvoiceType: typeof subscription.latest_invoice,
					latestInvoiceId:
						typeof subscription.latest_invoice === "string"
							? subscription.latest_invoice
							: subscription.latest_invoice?.id,
					paymentIntentType: typeof paymentIntent,
					invoiceStatus: invoice?.status,
					confirmationSecretType: typeof invoice?.confirmation_secret,
				});

				return res.status(500).json({
					message:
						"Stripe did not return a payment intent for the subscription invoice",
				});
			}

			await Manager.updateStripeSubscriptionData(manager.id, {
				stripeCustomerId,
				stripeSubscriptionId: subscription.id,
				subscriptionStatus: normalizeSubscriptionStatus(
					subscription.status,
				),
			});

			return res.status(201).json({
				clientSecret,
				subscriptionId: subscription.id,
			});
		} catch (err) {
			next(err);
		}
	},

	getSubscriptionStatus: async (req, res, next) => {
		try {
			const [managerRows] = await Manager.getById(req.user.id);
			if (!managerRows.length) {
				return res.status(404).json({ message: "Manager not found" });
			}

			const manager = managerRows[0];

			if (!manager.stripe_customer_id) {
				return res.json({ status: "inactive", plan: null });
			}

			const subscriptions = await stripe.subscriptions.list({
				customer: manager.stripe_customer_id,
				status: "active",
				limit: 1,
			});

			const subscription = subscriptions.data[0] || null;

			if (subscription) {
				const subscriptionStart = subscription.current_period_start
					? new Date(subscription.current_period_start * 1000)
							.toISOString()
							.slice(0, 10)
					: null;
				const subscriptionEnd = subscription.current_period_end
					? new Date(subscription.current_period_end * 1000)
							.toISOString()
							.slice(0, 10)
					: null;

				await Manager.updateSubscription(manager.id, {
					subscription_active: true,
					subscription_start: subscriptionStart,
					subscription_end: subscriptionEnd,
				});

				await Manager.updateStripeSubscriptionData(manager.id, {
					stripeCustomerId: manager.stripe_customer_id,
					stripeSubscriptionId: subscription.id,
					subscriptionStatus: normalizeSubscriptionStatus(
						subscription.status,
					),
				});
			}

			return res.json({
				status: subscription?.status || "inactive",
				plan: subscription?.items.data[0]?.price.nickname || null,
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
		const sig = req.headers["stripe-signature"];
		let event;

		try {
			const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

			if (webhookSecret) {
				event = stripe.webhooks.constructEvent(
					req.body,
					sig,
					webhookSecret,
				);
			} else if (process.env.NODE_ENV !== "production") {
				console.warn(
					"Webhook secret missing, accepting Stripe webhook without signature verification in non-production mode",
				);
				event = JSON.parse(req.body.toString("utf8"));
			} else {
				throw new Error(
					"STRIPE_WEBHOOK_SECRET is required in production",
				);
			}
		} catch (err) {
			console.error(
				"Webhook signature verification failed:",
				err.message,
			);
			return res
				.status(400)
				.json({ message: `Webhook Error: ${err.message}` });
		}

		try {
			switch (event.type) {
				case "checkout.session.completed": {
					const session = event.data.object;

					if (session.mode !== "subscription") {
						console.log(
							`Webhook: checkout session ignored for mode ${session.mode}`,
						);
						break;
					}

					const sessionEmail =
						await resolveCheckoutSessionEmail(session);
					if (!sessionEmail) {
						console.warn(
							"Webhook: checkout session without email, cannot sync manager subscription",
						);
						break;
					}

					const subscription = session.subscription
						? await stripe.subscriptions.retrieve(
								session.subscription,
							)
						: null;

					if (!subscription) {
						console.warn(
							"Webhook: checkout session without subscription id",
						);
						break;
					}

					const manager = await syncManagerFromStripeSubscription(
						subscription,
						sessionEmail,
					);

					if (!manager) {
						console.warn(
							`Webhook: no manager found for checkout session email ${sessionEmail}`,
						);
						break;
					}

					console.log(
						`Webhook: manager ${manager.id} activated from checkout session ${session.id}`,
					);
					break;
				}

				case "customer.subscription.created":
				case "customer.subscription.updated": {
					const subscription = event.data.object;
					const customer = subscription.customer
						? await stripe.customers.retrieve(subscription.customer)
						: null;
					const email =
						customer && !customer.deleted
							? customer.email || null
							: null;

					const manager = await syncManagerFromStripeSubscription(
						subscription,
						email,
					);

					if (!manager) {
						console.warn(
							`Webhook: no manager found for subscription ${subscription.id}`,
						);
						break;
					}

					console.log(
						`Webhook: manager ${manager.id} synced from subscription ${subscription.id} with status ${subscription.status}`,
					);
					break;
				}

				case "customer.subscription.deleted": {
					const subscription = event.data.object;
					const customer = subscription.customer
						? await stripe.customers.retrieve(subscription.customer)
						: null;
					const email =
						customer && !customer.deleted
							? customer.email || null
							: null;

					if (!email) {
						break;
					}

					const [managerRows] = await Manager.getByEmail(email);
					if (!managerRows.length) {
						break;
					}

					const manager = managerRows[0];
					await Manager.updateSubscription(manager.id, {
						subscription_active: false,
						subscription_start: manager.subscription_start,
						subscription_end: manager.subscription_end,
					});

					await Manager.updateStripeSubscriptionData(manager.id, {
						stripeCustomerId: subscription.customer,
						stripeSubscriptionId: subscription.id,
						subscriptionStatus: normalizeSubscriptionStatus(
							subscription.status,
						),
					});

					console.log(
						`Webhook: manager ${manager.id} marked inactive from deleted subscription ${subscription.id}`,
					);
					break;
				}

				case "payment_intent.succeeded": {
					const paymentIntent = event.data.object;

					const bookingId = paymentIntent.metadata?.bookingId;

					if (!bookingId) {
						console.warn(
							"Webhook: paymentIntent without bookingId in metadata",
						);
						break;
					}

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

					await Booking.updateStatus(bookingId, "confirmed");

					if (existingPayments.length > 0) {
						await Payment.updateStatus(
							existingPayments[0].id,
							"success",
						);
					} else {
						await Payment.create({
							booking_id: bookingId,
							amount: paymentIntent.amount / 100,
							status: "success",
							method: "card",
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
							const [userRows] = await User.getById(
								booking.user_id,
							);
							if (!userRows.length) {
								console.warn(
									`Webhook: user ${booking.user_id} not found for email`,
								);
								break;
							}
							user = userRows[0];
						}

						await emailService.sendBookingConfirmationEmail(
							user,
							booking,
						);
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

				case "payment_intent.payment_failed": {
					const paymentIntent = event.data.object;
					const bookingId = paymentIntent.metadata?.bookingId;

					if (!bookingId) break;

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
			console.error("Webhook processing error:", err);
		}

		res.json({ received: true });
	},
};

module.exports = stripeController;
