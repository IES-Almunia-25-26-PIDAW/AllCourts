import { request } from "@/api/http";
import type { CourtSchedule } from "@/types/courtSchedule";

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
