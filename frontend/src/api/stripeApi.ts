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

interface SubscriptionResponse {
	clientSecret: string;
	subscriptionId: string;
}

interface SubscriptionStatusResponse {
	status: string;
	plan: string | null;
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

/**
 * Crea una suscripción de Stripe asociada al plan seleccionado.
 *
 * @param priceId Identificador del precio en Stripe.
 * @returns {Promise<SubscriptionResponse>} Datos necesarios para confirmar el pago.
 */
export async function createSubscription(
	priceId: string,
): Promise<SubscriptionResponse> {
	return request<SubscriptionResponse>("/stripe/create-subscription", {
		method: "POST",
		body: JSON.stringify({ priceId }),
	});
}

/**
 * Obtiene el estado de la suscripción del manager autenticado.
 *
 * @returns {Promise<SubscriptionStatusResponse>} Estado y plan activo.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
	return request<SubscriptionStatusResponse>("/stripe/subscription-status");
}
