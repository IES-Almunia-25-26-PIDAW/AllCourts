import { request } from "./http";
import type { Club, ClubWithManager, CreateClubDTO, UpdateClubDTO } from "@/types/club";

/**
 * @module clubApi
 * Cliente API para consultar clubes desde el backend.
 * Se usa en el listado de clubes y en la pantalla de detalle.
 */

/**
 * Obtiene el listado completo de clubes.
 *
 * @returns {Promise<ClubWithManager[]>} Lista de clubes.
 */
export async function getClubs(): Promise<ClubWithManager[]> {
  return request<ClubWithManager[]>("/clubs");
}

/**
 * Obtiene el detalle de un club concreto por su identificador.
 *
 * @param id Identificador del club.
 * @returns {Promise<ClubWithManager>} Detalle del club.
 */
export async function getClubById(
  id: string | number,
): Promise<ClubWithManager> {
  return request<ClubWithManager>(`/clubs/${id}`);
}

export async function createClub(data: CreateClubDTO): Promise<Club> {
  return request<Club>("/clubs", { method: "POST", body: JSON.stringify(data) });
}

export async function updateClub(id: number, data: UpdateClubDTO): Promise<Club> {
  return request<Club>(`/clubs/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteClub(id: number): Promise<void> {
  return request<void>(`/clubs/${id}`, { method: "DELETE" });
}
