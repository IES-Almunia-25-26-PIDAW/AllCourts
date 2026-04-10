import { request } from "./http";
import type { ClubWithManager } from "@/types/club";

/**
 * Cliente API para consultar clubes desde el backend.
 * Se usa en el listado de clubes y en la pantalla de detalle.
 */
export async function getClubs(): Promise<ClubWithManager[]> {
  // Usado por la página principal de clubes.
  return request<ClubWithManager[]>("/clubs");
}

/**
 * Obtiene el detalle de un club concreto.
 */
export async function getClubById(
  id: string | number,
): Promise<ClubWithManager> {
  // Usado por la página de detalle del club para cargar sus datos.
  return request<ClubWithManager>(`/clubs/${id}`);
}
