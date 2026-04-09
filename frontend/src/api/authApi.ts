import type {
	AuthResponse,
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

export async function getCurrentUser(token: string): Promise<User> {
	return request<User>("/auth/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export async function login(
	credentials: LoginCredentials
): Promise<AuthResponse> {
	const response = await request<{ token: string }>("/auth/login", {
		method: "POST",
		body: JSON.stringify(credentials),
	});

	const user = await getCurrentUser(response.token);

	return {
		token: response.token,
		user,
	};
}

export async function register(userData: CreateUserDTO): Promise<{ message: string; token: string }> {
	return request<{ message: string; token: string }>("/auth/register", {
		method: "POST",
		body: JSON.stringify(userData),
	});
}
