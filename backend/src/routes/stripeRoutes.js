const express = require("express");
const stripeController = require("../controllers/stripeController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @module stripeRouter
 *
 * El router de Stripe tiene dos rutas con necesidades opuestas respecto al body:
 *
 *  POST /create-payment-intent
 *    → Necesita body parseado como JSON (bookingId viene en el body).
 *    → Requiere autenticación.
 *    → Aplicamos express.json() SOLO en esta ruta para no interferir con el webhook.
 *
 *  POST /webhook
 *    → Necesita body RAW (Buffer) para que Stripe pueda verificar la firma.
 *    → NO requiere autenticación (viene de los servidores de Stripe).
 *    → Aplicamos express.raw() SOLO en esta ruta.
 */

const router = express.Router();
router.post(
	"/create-payment-intent",
	express.json(), 
	authMiddleware, 
	stripeController.createPaymentIntent,
);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }), 
	stripeController.webhook,
);

module.exports = router;
