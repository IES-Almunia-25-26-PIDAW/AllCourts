import { request } from "./http";
import type { ClubWithManager } from "@/types/club";

/**
 * Client API para consultar clubes desde el backend.
 * Se usa en el listado de clubes y en la pantalla de detalle.
 */
export async function getClubs(): Promise<ClubWithManager[]> {
  return request<ClubWithManager[]>("/clubs");
}

export async function getClubById(
  id: string | number,
): Promise<ClubWithManager> {
  return request<ClubWithManager>(`/clubs/${id}`);
}
