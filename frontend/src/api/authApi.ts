//#region MODULES
import { request } from '@/api/http';
import type { CreateUserDTO, LoginCredentials, User } from '@/types/user';
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
 *
 * @returns {Promise<User>} Usuario autenticado.
 */
export async function getCurrentUser(): Promise<User> {
  return request<User>('/auth/me');
}

/**
 * Inicia sesión y deja la cookie httpOnly preparada en el navegador.
 * Devuelve el usuario autenticado para sincronizar Redux y localStorage.
 *
 * @param credentials Credenciales de acceso.
 * @returns {Promise<{ user: User }>} Respuesta con el usuario autenticado.
 */
export async function login(credentials: LoginCredentials): Promise<{ user: User }> {
  return request<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

/**
 * Registra un nuevo usuario y deja la cuenta pendiente de verificación por email.
 *
 * @param userData Datos del usuario a crear.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function register(userData: CreateUserDTO): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * Cierra sesión y elimina la cookie httpOnly del backend.
 * Se usa para limpiar la sesión local y forzar el estado anónimo.
 *
 * @returns {Promise<void>} No devuelve contenido útil.
 */
export async function logout(): Promise<void> {
  await request<{ message: string }>('/auth/logout', { method: 'POST' });
}

/**
 * Verifica una cuenta usando el token recibido por correo.
 *
 * @param token Token de verificación.
 * @returns {Promise<{ message: string }>} Mensaje del backend.
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/verify/${token}`);
}

/**
 * Solicita un enlace de recuperación de contraseña para el email indicado.
 *
 * @param email Correo del usuario.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/**
 * Restablece la contraseña del usuario a partir del token enviado por email.
 *
 * @param token Token de recuperación.
 * @param newPassword Nueva contraseña.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ newPassword })
  });
}

/**
 * Reenvía el correo de verificación a una cuenta pendiente de confirmar.
 *
 * @param email Correo del usuario.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function resendVerification(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}
//#endregion
