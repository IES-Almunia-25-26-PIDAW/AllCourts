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

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
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