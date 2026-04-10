import type { Court } from "@/types/court";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type CourtWithClub = Court & {
  club_name?: string;
  address?: string;
  city?: string;
  logo_url?: string;
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
