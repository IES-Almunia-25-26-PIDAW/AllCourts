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
  const apiUrl =
    typeof window !== 'undefined' ? window.__ALLCOURTS_CONFIG__?.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return apiUrl;
}
//#endregion
