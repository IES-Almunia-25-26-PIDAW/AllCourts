import { request } from "@/api/http";
import type {
	CourtSchedule,
	CreateCourtScheduleDTO,
	UpdateCourtScheduleDTO,
} from "@/types/courtSchedule";
/**
 * @module courtScheduleApi
 * Cliente API para consultar los horarios de pistas.
 * Se usa en la ficha de club para resumir la disponibilidad semanal.
 */

/**
 * Obtiene todos los horarios configurados para una pista concreta.
 *
 * @param courtId Identificador de la pista.
 * @returns {Promise<CourtSchedule[]>} Lista de horarios de la pista.
 */
export async function getCourtSchedulesByCourtId(
	courtId: string | number,
): Promise<CourtSchedule[]> {
	return request<CourtSchedule[]>(`/court-schedules/court/${courtId}`);
}

/**
 * Guarda (o sobreescribe) los 7 días de horario de una pista de golpe.
 * Llama a POST /court-schedules/bulk
 */
export async function upsertBulkCourtSchedules(
	courtId: number,
	schedules: Omit<CreateCourtScheduleDTO, "court_id">[],
): Promise<{ message: string }> {
	return request<{ message: string }>("/court-schedules/bulk", {
		method: "POST",
		body: JSON.stringify({ court_id: courtId, schedules }),
	});
}

/**
 * Guarda o actualiza el horario de un día concreto de una pista.
 * Llama a POST /court-schedules
 */
export async function upsertCourtSchedule(
	dto: CreateCourtScheduleDTO,
): Promise<{ message: string }> {
	return request<{ message: string }>("/court-schedules", {
		method: "POST",
		body: JSON.stringify(dto),
	});
}

/**
 * Actualiza un horario existente por su id.
 * Llama a PUT /court-schedules/:id
 */
export async function updateCourtSchedule(
	id: number,
	dto: UpdateCourtScheduleDTO,
): Promise<{ message: string }> {
	return request<{ message: string }>(`/court-schedules/${id}`, {
		method: "PUT",
		body: JSON.stringify(dto),
	});
}

/**
 * Elimina todos los horarios de una pista.
 * Llama a DELETE /court-schedules/court/:courtId
 */
export async function deleteCourtSchedulesByCourtId(
	courtId: number,
): Promise<{ message: string }> {
	return request<{ message: string }>(`/court-schedules/court/${courtId}`, {
		method: "DELETE",
	});
}
