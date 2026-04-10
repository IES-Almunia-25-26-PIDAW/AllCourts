import { request } from "@/api/http";
import type { CourtWithClub } from "@/types/court";

/**
 * Client API para consultar pistas desde el backend.
 * Incluye listado general, listado por club y detalle individual.
 */
export async function getCourts(): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>("/courts");
}

export async function getCourtsByClubId(
  clubId: string | number,
): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>(`/courts/club/${clubId}`);
}

export async function getCourtById(
  id: string | number,
): Promise<CourtWithClub> {
  return request<CourtWithClub>(`/courts/${id}`);
}
