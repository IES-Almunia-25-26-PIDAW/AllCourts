import { getApiUrl } from "@/utils/runtimeConfig";

/**
 * Resuelve una URL de imagen absoluta o relativa a una URL segura para la UI.
 *
 * @param imageUrl URL recibida desde el backend o null/undefined.
 * @param fallback Imagen por defecto cuando no hay URL válida.
 * @returns {string} URL final lista para renderizar.
 */
export function resolveImageUrl(
	imageUrl?: string | null,
	fallback = "/logoallcourts.png",
): string {
	if (!imageUrl) {
		return fallback;
	}

	if (imageUrl.startsWith("http")) {
		return imageUrl;
	}

	if (imageUrl.startsWith("/uploads/")) {
		try {
			const apiUrl = getApiUrl();
			return `${apiUrl}${imageUrl}`;
		} catch (e) {
			return imageUrl;
		}
	}

	return imageUrl;
}
