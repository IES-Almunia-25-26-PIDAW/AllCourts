import { request } from "@/api/http";
import type { Manager, UpdateManagerDTO } from "@/types/manager";
import type { ManagerStats } from "@/types/manager";
import type { Club } from "@/types/club";
import type { Court } from "@/types/court";
import type { Booking } from "@/types/booking";

/**
 * @module managerApi
 * Cliente API para el panel de gestores.
 * Agrupa perfil, estadísticas, pistas, clubes y reservas visibles en el dashboard.
 */

/**
 * Obtiene el perfil de manager asociado a un usuario.
 *
 * @param userId Identificador del usuario.
 * @returns {Promise<Manager>} Perfil de manager.
 */
export async function getManagerByUserId(userId: string): Promise<Manager> {
	return request<Manager>(`/managers/user/${userId}`);
}

/**
 * Obtiene las métricas resumen del panel de gestor.
 *
 * @param managerId Identificador del manager.
 * @returns {Promise<ManagerStats>} Métricas agregadas.
 */
export async function getManagerStats(
	managerId: string,
): Promise<ManagerStats> {
	return request<ManagerStats>(`/managers/${managerId}/stats`);
}

/**
 * Obtiene todas las pistas asociadas a un manager.
 *
 * @param managerId Identificador del manager.
 * @returns {Promise<Court[]>} Lista de pistas.
 */
export async function getManagerCourts(managerId: string): Promise<Court[]> {
	return request<Court[]>(`/managers/${managerId}/courts`);
}

/**
 * Obtiene todos los clubes asociados a un manager.
 *
 * @param managerId Identificador del manager.
 * @returns {Promise<Club[]>} Lista de clubes.
 */
export async function getManagerClubs(managerId: string): Promise<Club[]> {
	return request<Club[]>(`/clubs/manager/${managerId}`);
}

/**
 * Obtiene todas las reservas visibles para el panel de gestor.
 *
 * @returns {Promise<Booking[]>} Lista de reservas.
 */
export async function getAllBookings(): Promise<Booking[]> {
	return request<Booking[]>(`/bookings`);
}

/**
 * Actualiza los datos de suscripción de un manager.
 *
 * @param managerId Identificador del manager.
 * @param data Datos de suscripción a actualizar.
 * @returns {Promise<void>} No devuelve contenido útil.
 */
export async function updateSubscription(
	managerId: string,
	data: UpdateManagerDTO,
): Promise<void> {
	await request<void>(`/managers/${managerId}/subscription`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}
