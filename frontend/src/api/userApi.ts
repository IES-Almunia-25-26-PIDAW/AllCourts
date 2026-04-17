//#region MODULES
import { request } from "@/api/http";
import type { UpdateUserDTO, User } from "@/types/user";
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
 */
export async function getUserById(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}

/**
 * Actualiza un usuario enviando JSON.
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
 */
export async function updateUserForm(
  id: string,
  formData: FormData,
): Promise<User> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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
 */
export async function updateUserPassword(
  id: string,
  password: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
}

/**
 * Elimina un usuario.
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}
//#endregion
