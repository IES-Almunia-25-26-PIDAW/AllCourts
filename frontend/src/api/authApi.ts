import type {
	CreateUserDTO,
	LoginCredentials,
	User,
} from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

/**
 * Obtiene el usuario autenticado usando la cookie httpOnly.
 * No requiere token explícito: el navegador envía la cookie automáticamente.
 */
export async function getCurrentUser(): Promise<User> {
	return request<User>("/auth/me");
}

/**
 * Inicia sesión. El backend pone la cookie httpOnly y devuelve los datos del usuario.
 * El token JWT nunca llega al JavaScript del cliente.
 */
export async function login(
	credentials: LoginCredentials
): Promise<{ user: User }> {
	return request<{ user: User }>("/auth/login", {
		method: "POST",
		body: JSON.stringify(credentials),
	});
}

/**
 * Registra un nuevo usuario. No devuelve token (el usuario debe verificar su email primero).
 */
export async function register(userData: CreateUserDTO): Promise<{ message: string }> {
	return request<{ message: string }>("/auth/register", {
		method: "POST",
		body: JSON.stringify(userData),
	});
}

/**
 * Cierra sesión. El backend borra la cookie httpOnly.
 */
export async function logout(): Promise<void> {
	await request<{ message: string }>("/auth/logout", { method: "POST" });
}
