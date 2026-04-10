import type { Club } from "@/types/club";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Client API para consultar clubes desde el backend.
 * Se usa en el listado de clubes y en la pantalla de detalle.
 */
export type ClubWithManager = Club & {
  manager_name?: string;
  manager_email?: string;
};

type ApiErrorResponse = {
  message?: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const payload = (await readJson<ApiErrorResponse & T>(response)) as
    | ApiErrorResponse
    | T;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? (payload as ApiErrorResponse).message
        : "Request failed";

    throw new Error(message || "Request failed");
  }

  return payload as T;
}

export async function getClubs(): Promise<ClubWithManager[]> {
  return request<ClubWithManager[]>("/clubs");
}

export async function getClubById(
  id: string | number,
): Promise<ClubWithManager> {
  return request<ClubWithManager>(`/clubs/${id}`);
}
