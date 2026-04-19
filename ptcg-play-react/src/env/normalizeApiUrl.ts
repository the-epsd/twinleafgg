/**
 * Local ptcg-server is HTTP on 8080 by default. TLS / fetch errors often come from
 * `https://localhost` persisted in localStorage or typed on the login form.
 * Real HTTPS on loopback is rare; if you need it, use a non-loopback host name.
 */
export function normalizeDevLocalApiUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) {
    return trimmed;
  }
  try {
    const u = new URL(trimmed);
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    if (local && u.protocol === 'https:') {
      u.protocol = 'http:';
      return u.toString().replace(/\/$/, '');
    }
  } catch {
    /* invalid URL, return as-is */
  }
  return trimmed;
}
