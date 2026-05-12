//#region MODULES
import { request } from "@/api/http";
import type { UpdateUserDTO, User } from "@/types/user";
import { getApiUrl } from "@/utils/runtimeConfig";
//#endregion

//#region DOCUMENTATION
/**
 * @module userApi
 * Cliente API para operaciones de usuario.
 * Se usa principalmente desde la página de perfil para actualizar datos
 * básicos y el avatar.
 */
//#endregion

//#region FUNCTIONS
/**
 * Obtiene un usuario por ID.
 * Se usa en pantallas de perfil y mantenimiento de datos de usuario.
 *
 * @param id Identificador del usuario.
 * @returns {Promise<User>} Usuario encontrado.
 */
export async function getUserById(id: string): Promise<User> {
	return request<User>(`/users/${id}`);
}

/**
 * Actualiza un usuario enviando JSON.
 * Se usa cuando no hace falta subir un avatar nuevo.
 *
 * @param id Identificador del usuario.
 * @param data Datos de actualización.
 * @returns {Promise<User>} Usuario actualizado.
 */
export async function updateUser(
	id: string,
	data: UpdateUserDTO,
): Promise<User> {
	return request<User>(`/users/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

/**
 * Actualiza un usuario enviando multipart/form-data.
 * Se usa cuando el perfil incluye subida de avatar.
 *
 * @param id Identificador del usuario.
 * @param formData FormData con los campos del perfil.
 * @returns {Promise<User>} Usuario actualizado.
 */
export async function updateUserForm(
	id: string,
	formData: FormData,
): Promise<User> {
	const apiUrl = getApiUrl();
	const response = await fetch(
		`${apiUrl}/users/${id}`,
		{
			method: "PUT",
			credentials: "include",
			body: formData,
		},
	);

	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.message || "Request failed");
	}

	return payload as User;
}

/**
 * Cambia la contraseña de un usuario.
 * Se usa desde el bloque de seguridad del perfil.
 *
 * @param id Identificador del usuario.
 * @param currentPassword Contraseña actual.
 * @param newPassword Nueva contraseña.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function updateUserPassword(
	id: string,
	currentPassword: string,
	newPassword: string,
): Promise<{ message: string }> {
	return request<{ message: string }>(`/users/${id}/password`, {
		method: "PATCH",
		body: JSON.stringify({ currentPassword, password: newPassword }),
	});
}

/**
 * Elimina un usuario.
 * Se reserva para acciones de administración o baja definitiva.
 *
 * @param id Identificador del usuario.
 * @returns {Promise<{ message: string }>} Mensaje de confirmación.
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
	return request<{ message: string }>(`/users/${id}`, {
		method: "DELETE",
	});
}
//#endregion
