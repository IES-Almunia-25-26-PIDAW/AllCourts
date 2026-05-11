import { useRouter } from "next/router";

export function useRouteQueryParam(paramName: string) {
	const router = useRouter();
	const value = router.isReady ? router.query[paramName] : undefined;

	return {
		ready: router.isReady,
		value: Array.isArray(value) ? value[0] : value,
	};
}