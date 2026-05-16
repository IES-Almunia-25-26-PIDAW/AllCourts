type RuntimeConfig = {
	NEXT_PUBLIC_API_URL?: string;
};

declare global {
	interface Window {
		__ALLCOURTS_CONFIG__?: RuntimeConfig;
	}
}

/**
 * Obtiene la URL base de la API desde el navegador o desde el entorno.
 *
 * @returns {string} URL base configurada para el backend.
 */
export function getApiUrl(): string {
	const apiUrl =
		typeof window !== "undefined"
			? window.__ALLCOURTS_CONFIG__?.NEXT_PUBLIC_API_URL
			: process.env.NEXT_PUBLIC_API_URL;

	if (!apiUrl) {
		throw new Error("NEXT_PUBLIC_API_URL is not configured");
	}

	return apiUrl;
}
