import { useRouter } from "next/router";

/**
 * Lee un parámetro de query de la ruta de forma segura para Next.js.
 *
 * @param paramName Nombre del parámetro en la URL.
 * @returns {{ready: boolean, value: string | string[] | undefined}} Estado y valor del parámetro.
 */
export function useRouteQueryParam(paramName: string) {
	const router = useRouter();
	const value = router.isReady ? router.query[paramName] : undefined;

	return {
		ready: router.isReady,
		value: Array.isArray(value) ? value[0] : value,
	};
}
