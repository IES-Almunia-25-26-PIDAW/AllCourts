//#region MODULES
const API_URL = process.env.NEXT_PUBLIC_API_URL;
//#endregion

//#region TYPES
type ApiErrorResponse = {
  message?: string;
};

let refreshPromise: Promise<boolean> | null = null;
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
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return (await response.json()) as T;
}

/**
 * Intenta refrescar la sesión usando la cookie httpOnly actual.
 * Se usa automáticamente cuando una petición devuelve 401 y la ruta no está excluida.
 *
 * @returns {Promise<boolean>} Indica si el refresh fue exitoso.
 */
async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Ejecuta una petición al backend con la configuración común del frontend.
 *
 * @template T
 * @param path Ruta relativa del endpoint, por ejemplo /clubs o /auth/me.
 * @param init Opciones estándar de fetch para métodos, headers o body.
 * @returns {Promise<T>} La respuesta tipada del backend.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const execute = async () => {
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

    return { response, payload };
  };

  let { response, payload } = await execute();

  const skipRefresh =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register") ||
    path.startsWith("/auth/logout") ||
    path.startsWith("/auth/refresh") ||
    path.startsWith("/auth/verify");

  if (response.status === 401 && !skipRefresh) {
    const refreshed = await refreshSession();
    if (refreshed) {
      ({ response, payload } = await execute());
    }
  }

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
