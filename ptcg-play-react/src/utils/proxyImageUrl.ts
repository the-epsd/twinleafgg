import { appConfig } from '../env/config';

/** Normalize protocol-relative CDN URLs (`//cdn.example/...`). */
export function normalizeImageSourceUrl(url: string): string {
  const t = url.trim();
  if (t.startsWith('//')) {
    return `https:${t}`;
  }
  return t;
}

export function isProxiedImageUrl(url: string): boolean {
  const t = url.trim();
  if (!t) {
    return false;
  }
  if (t.startsWith('/v1/images/proxy')) {
    return true;
  }
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const u = new URL(t, base);
    return u.pathname === '/v1/images/proxy' || u.pathname.endsWith('/v1/images/proxy');
  } catch {
    return t.includes('/v1/images/proxy');
  }
}

/** True for http(s) URLs on a different origin than the SPA (CDN hosts, etc.). */
export function isExternalImageUrl(url: string): boolean {
  const t = normalizeImageSourceUrl(url);
  if (!t || t.startsWith('data:') || t.startsWith('blob:')) {
    return false;
  }
  if (/^https?:\/\//i.test(t)) {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      return new URL(t).origin !== window.location.origin;
    } catch {
      return true;
    }
  }
  return false;
}

/**
 * Wrap external scan URLs in the server image proxy using a same-origin path so
 * WebGL textures load without CDN CORS headers. Vite dev and production nginx
 * forward `/v1` to the API server.
 */
export function proxyImageUrlForWebGl(sourceUrl: string): string {
  const normalized = normalizeImageSourceUrl(sourceUrl);
  if (!normalized || isProxiedImageUrl(normalized) || !isExternalImageUrl(normalized)) {
    return normalized || sourceUrl;
  }
  const encoded = encodeURIComponent(normalized);
  if (typeof window !== 'undefined') {
    return `/v1/images/proxy?url=${encoded}`;
  }
  const base = appConfig.apiUrl.replace(/\/$/, '');
  return `${base}/v1/images/proxy?url=${encoded}`;
}

/** Only set crossOrigin on TextureLoader when the URL is actually cross-origin. */
export function imageUrlNeedsCrossOrigin(url: string): boolean {
  const t = url.trim();
  if (!/^https?:\/\//i.test(t)) {
    return false;
  }
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    return new URL(t).origin !== window.location.origin;
  } catch {
    return true;
  }
}
