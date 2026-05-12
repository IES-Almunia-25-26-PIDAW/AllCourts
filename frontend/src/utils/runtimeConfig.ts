//#region TYPES
type RuntimeConfig = {
	NEXT_PUBLIC_API_URL?: string;
};

declare global {
	interface Window {
		__ALLCOURTS_CONFIG__?: RuntimeConfig;
	}
}
//#endregion

//#region FUNCTIONS
export function getApiUrl(): string {
	if (typeof window !== "undefined") {
		return window.__ALLCOURTS_CONFIG__?.NEXT_PUBLIC_API_URL || "";
	}

	return process.env.NEXT_PUBLIC_API_URL || "";
}
//#endregion