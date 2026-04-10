import type { UpdateUserDTO, User } from "@/types/user";

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

export async function updateUser(id: number, data: UpdateUserDTO): Promise<{ message: string }>{
	return request<{ message: string }>(`/users/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function updateUserForm(id: number, formData: FormData): Promise<User> {
	const response = await fetch(`${API_URL}/users/${id}`, {
		method: "PUT",
		credentials: "include",
		body: formData,
	});

	const payload = await readJson<any>(response);

	if (!response.ok) {
		const message = payload && payload.message ? payload.message : "Request failed";
		throw new Error(message);
	}

	return payload as User;
}

export default {};
