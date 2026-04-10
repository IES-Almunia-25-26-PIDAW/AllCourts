const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiErrorResponse = {
  message?: string;
};

/**
 * Lee la respuesta como JSON solo cuando el backend devuelve ese formato.
 */
async function readJson<T>(response: Response): Promise<T> {
  // Algunas rutas pueden devolver contenido no JSON, así que protegemos el parseo.
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return (await response.json()) as T;
}

/**
 * Ejecuta una petición al backend con la configuración común del frontend.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Centralizamos el fetch para que todos los clientes compartan auth y errores.
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

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
