//#region MODULES
import type { CreateUserDTO, LoginCredentials, User } from "@/types/user";
import { request } from "@/api/http";
//#endregion

//#region DOCUMENTATION
/**
 * @module authApi
 * Cliente API de autenticación del frontend.
 * Agrupa las operaciones de sesión, login, registro y cierre de sesión.
 *
 * Funciones públicas:
 *   getCurrentUser → obtiene el usuario autenticado desde la cookie httpOnly
 *   login          → inicia sesión y devuelve el usuario autenticado
 *   register       → crea una cuenta nueva y devuelve el mensaje del backend
 *   logout         → cierra la sesión y limpia la cookie httpOnly
 *
 * Comportamiento:
 *   - Usa el helper compartido request para mantener la configuración uniforme.
 *   - No expone tokens JWT en JavaScript.
 *   - Devuelve respuestas tipadas para sincronizar Redux y localStorage.
 */
//#endregion

//#region FUNCTIONS
/**
 * Obtiene el usuario autenticado usando la cookie httpOnly.
 * Se usa al arrancar la app para hidratar la sesión real del usuario.
 */
export async function getCurrentUser(): Promise<User> {
	return request<User>("/auth/me");
}

/**
 * Inicia sesión y deja la cookie httpOnly preparada en el navegador.
 * Devuelve el usuario autenticado para sincronizar Redux y localStorage.
 */
export async function login(
	credentials: LoginCredentials,
): Promise<{ user: User }> {
	return request<{ user: User }>("/auth/login", {
		method: "POST",
		body: JSON.stringify(credentials),
	});
}

/**
 * Registra un nuevo usuario y deja la cuenta pendiente de verificación por email.
 */
export async function register(
	userData: CreateUserDTO,
): Promise<{ message: string }> {
	return request<{ message: string }>("/auth/register", {
		method: "POST",
		body: JSON.stringify(userData),
	});
}

/**
 * Cierra sesión y elimina la cookie httpOnly del backend.
 * Se usa para limpiar la sesión local y forzar el estado anónimo.
 */
export async function logout(): Promise<void> {
	await request<{ message: string }>("/auth/logout", { method: "POST" });
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
	return request<{ message: string }>(`/auth/verify/${token}`);
}
//#endregion
