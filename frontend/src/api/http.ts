import type { ApiErrorResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export async function request<T>(path: string): Promise<T> {
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
