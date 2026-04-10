//#region MODULES
import { request } from "@/api/http";
import type { CourtWithClub } from "@/types/court";
//#endregion

//#region DOCUMENTATION
/**
 * @module courtApi
 * Cliente API para consultar pistas desde el backend.
 * Exponemos aquí las tres consultas que usa la interfaz: listado general, listado por club y detalle individual.
 *
 * Funciones públicas:
 *   getCourts         → obtiene todas las pistas para la pantalla de búsqueda
 *   getCourtsByClubId → obtiene las pistas asociadas a un club concreto
 *   getCourtById      → obtiene el detalle completo de una pista
 *
 * Comportamiento:
 *   - Reutiliza el helper request para mantener cookies y errores uniformes.
 *   - Devuelve tipos compartidos del dominio para no duplicar contratos.
 */
//#endregion

//#region FUNCTIONS
/**
 * Obtiene todas las pistas.
 * Se usa en la pantalla de búsqueda general.
 */
export async function getCourts(): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>("/courts");
}

/**
 * Obtiene las pistas de un club concreto.
 * Se usa en la ficha del club para mostrar sus pistas relacionadas.
 */
export async function getCourtsByClubId(
  clubId: string | number,
): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>(`/courts/club/${clubId}`);
}

/**
 * Obtiene el detalle de una pista concreta.
 * Se usa en la pantalla de detalle para recuperar precios, superficie y metadatos.
 */
export async function getCourtById(
  id: string | number,
): Promise<CourtWithClub> {
  return request<CourtWithClub>(`/courts/${id}`);
}
//#endregion
