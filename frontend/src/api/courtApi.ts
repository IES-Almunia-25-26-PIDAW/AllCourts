//#region MODULES
import { request } from '@/api/http';
import type { Court, CourtWithClub, CreateCourtDTO, UpdateCourtDTO } from '@/types/court';
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
 *
 * @returns {Promise<CourtWithClub[]>} Lista de pistas.
 */
export async function getCourts(): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>('/courts');
}

export async function getCourtsByClubId(clubId: string | number): Promise<CourtWithClub[]> {
  return request<CourtWithClub[]>(`/courts/club/${clubId}`);
}

/**
 * Obtiene el detalle de una pista concreta
 * Se usa en la pantalla de detalle para recuperar precios, superficie y metadatos
 *
 * @param id Identificador de la pista
 * @returns {Promise<CourtWithClub>} Detalle de la pista
 */
export async function getCourtById(id: string | number): Promise<CourtWithClub> {
  return request<CourtWithClub>(`/courts/${id}`);
}

export async function createCourt(data: CreateCourtDTO): Promise<Court> {
  return request<Court>('/courts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCourt(id: number, data: UpdateCourtDTO): Promise<Court> {
  return request<Court>(`/courts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCourt(id: number): Promise<void> {
  return request<void>(`/courts/${id}`, { method: 'DELETE' });
}
