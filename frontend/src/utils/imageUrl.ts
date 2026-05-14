import { getApiUrl } from '@/utils/runtimeConfig';

export function resolveImageUrl(imageUrl?: string | null, fallback = '/logoallcourts.png'): string {
  if (!imageUrl) {
    return fallback;
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads/')) {
    try {
      const apiUrl = getApiUrl();
      return `${apiUrl}${imageUrl}`;
    } catch (e) {
      // If API URL isn't configured at runtime, fall back to the relative path so
      // the browser can try loading it from the current origin. This keeps the
      // app resilient in development when env isn't injected at build time.
      return imageUrl;
    }
  }

  return imageUrl;
}
