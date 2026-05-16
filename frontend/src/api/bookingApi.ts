import { request } from "@/api/http";
import type {
	Booking,
	CreateBookingDTO,
	CreateBookingResponse,
	CourtAvailabilityResponse,
} from "@/types/booking";

/**
 * @module bookingApi
 * Cliente API para reservar pistas, consultar disponibilidad y gestionar reservas.
 * Agrupa las llamadas que usa el flujo de checkout y el historial de usuario.
 */

/**
 * Crea una reserva pendiente a partir de los datos del formulario de reserva.
 *
 * @param payload Datos de la reserva a crear.
 * @returns {Promise<CreateBookingResponse>} Respuesta con el id y el precio total.
 */
export async function createBooking(
	payload: CreateBookingDTO,
): Promise<CreateBookingResponse> {
	return request<CreateBookingResponse>("/bookings", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

/**
 * Consulta la disponibilidad de una pista para una fecha y duración concretas.
 *
 * @param courtId Identificador de la pista.
 * @param date Fecha en formato `YYYY-MM-DD`.
 * @param durationMin Duración de la reserva en minutos.
 * @returns {Promise<CourtAvailabilityResponse>} Horarios y huecos disponibles.
 */
export async function getCourtAvailability(
	courtId: string | number,
	date: string,
	durationMin: number,
): Promise<CourtAvailabilityResponse> {
	const query = new URLSearchParams({
		date,
		duration_min: String(durationMin),
	});

	return request<CourtAvailabilityResponse>(
		`/bookings/availability/${courtId}?${query.toString()}`,
	);
}

/**
 * Obtiene el historial de reservas de un usuario.
 *
 * @param userId Identificador del usuario.
 * @returns {Promise<Booking[]>} Lista de reservas del usuario.
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
	return request<Booking[]>(`/bookings/user/${userId}`);
}

/**
 * Cancela una reserva existente, incluyendo un motivo opcional.
 *
 * @param bookingId Identificador de la reserva.
 * @param cancelReason Motivo opcional de la cancelación.
 * @returns {Promise<void>} No devuelve contenido útil.
 */
export async function cancelBooking(
	bookingId: number,
	cancelReason?: string,
): Promise<void> {
	return request<void>(`/bookings/${bookingId}/cancel`, {
		method: "PATCH",
		body: JSON.stringify({ cancel_reason: cancelReason }),
	});
}
