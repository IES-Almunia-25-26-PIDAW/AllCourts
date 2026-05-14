import type { Club, ClubWithManager, CreateClubDTO, UpdateClubDTO } from '@/types/club';
import { getApiUrl } from '@/utils/runtimeConfig';
import { request } from './http';

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
  return request<ClubWithManager[]>('/clubs');
}

/**
 * Obtiene el detalle de un club concreto por su identificador.
 *
 * @param id Identificador del club.
 * @returns {Promise<ClubWithManager>} Detalle del club.
 */
export async function getClubById(id: string | number): Promise<ClubWithManager> {
  return request<ClubWithManager>(`/clubs/${id}`);
}

export async function createClub(data: CreateClubDTO): Promise<Club> {
  return request<Club>('/clubs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateClub(id: number, data: UpdateClubDTO): Promise<Club> {
  return request<Club>(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteClub(id: number): Promise<void> {
  return request<void>(`/clubs/${id}`, { method: 'DELETE' });
}

export async function uploadClubImage(file: File): Promise<{ url: string; fullUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${getApiUrl()}/clubs/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const body = (await res.json()) as { url: string; fullUrl?: string };
  const url = body.url;
  const fullUrl = body.fullUrl || (url.startsWith('http') ? url : `${getApiUrl()}${url}`);
  return { url, fullUrl };
}
