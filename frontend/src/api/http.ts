//#region MODULES
const API_URL = process.env.NEXT_PUBLIC_API_URL;
//#endregion

//#region TYPES
type ApiErrorResponse = {
  message?: string;
};
//#endregion

//#region DOCUMENTATION
/**
 * @module http
 * Helper compartido para todas las peticiones del frontend.
 * Centraliza el parseo de respuesta, la inclusión de cookies y el manejo de errores.
 *
 * Funciones internas:
 *   readJson → intenta leer la respuesta solo si el backend devuelve JSON
 *   request  → envuelve fetch con la configuración común de la app
 *
 * Comportamiento:
 *   - Añade credentials: "include" para enviar cookies httpOnly.
 *   - Normaliza el mensaje de error si la respuesta falla.
 *   - Evita repetir la misma lógica de red en cada cliente API.
 */
//#endregion

//#region FUNCTIONS
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
 *
 * @param path Ruta relativa del endpoint, por ejemplo /clubs o /auth/me.
 * @param init Opciones estándar de fetch para métodos, headers o body.
 * @returns La respuesta tipada del backend.
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
//#endregion
