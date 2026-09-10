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
 * True when the URL is served by the configured API host (sleeves, deck-boxes, avatars).
 * Those endpoints already emit CORS; they must not go through the CDN image proxy.
 */
export function isApiHostedImageUrl(url: string): boolean {
  const t = normalizeImageSourceUrl(url);
  if (!/^https?:\/\//i.test(t)) {
    return false;
  }
  const api = appConfig.apiUrl.replace(/\/$/, '');
  if (!api) {
    return false;
  }
  try {
    return new URL(t).origin === new URL(api).origin;
  } catch {
    return false;
  }
}

/**
 * Wrap external scan URLs in the server image proxy so WebGL textures load without
 * CDN CORS headers. Always targets `appConfig.apiUrl` (not a same-origin `/v1` path)
 * so textures reach the configured API whether or not Vite/nginx reverse-proxies `/v1`.
 * TextureLoader uses `crossOrigin: 'anonymous'` when the proxy URL is cross-origin.
 *
 * API-hosted static assets are left absolute: they already allow CORS, and proxying
 * them through `/v1/images/proxy` fails (400) and falls back to the default cardback.
 */
export function proxyImageUrlForWebGl(sourceUrl: string): string {
  const normalized = normalizeImageSourceUrl(sourceUrl);
  if (!normalized || isProxiedImageUrl(normalized) || !isExternalImageUrl(normalized)) {
    return normalized || sourceUrl;
  }
  if (isApiHostedImageUrl(normalized)) {
    return normalized;
  }
  const encoded = encodeURIComponent(normalized);
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
