import { request } from "./http";

/**
 * @module stripeApi
 * Funciones del frontend para comunicarse con las rutas de Stripe del backend.
 *
 * Principio de responsabilidad:
 *   Este archivo solo se encarga de las llamadas de red relacionadas con Stripe.
 *   La lógica de Stripe Elements (renderizar el formulario, confirmar el pago)
 *   vive en los componentes que usan @stripe/react-stripe-js.
 */

interface PaymentIntentResponse {
	clientSecret: string;
	paymentIntentId: string;
	amount: number;
}

/**
 * Crea un PaymentIntent asociado a una reserva.
 *
 * @param bookingId Identificador de la reserva.
 * @returns {Promise<PaymentIntentResponse>} Datos del PaymentIntent.
 */
export async function createPaymentIntent(
	bookingId: string | number,
): Promise<PaymentIntentResponse> {
	return request<PaymentIntentResponse>("/stripe/create-payment-intent", {
		method: "POST",
		body: JSON.stringify({ bookingId }),
	});
}
