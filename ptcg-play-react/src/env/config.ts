import { normalizeDevLocalApiUrl } from './normalizeApiUrl';

function readStoredApiUrlRepaired(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem('apiUrl');
  if (!raw) {
    return null;
  }
  const rawTrim = raw.trim().replace(/\/$/, '');
  const normalized = normalizeDevLocalApiUrl(raw);
  if (normalized !== rawTrim) {
    localStorage.setItem('apiUrl', normalized);
  }
  return normalized;
}

export const appConfig = {
  get apiUrl(): string {
    const stored = readStoredApiUrlRepaired();
    if (stored) {
      return stored;
    }
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      return normalizeDevLocalApiUrl(envUrl);
    }
    if (typeof window !== 'undefined') {
      return window.location.origin.replace(/\/$/, '');
    }
    return '';
  },

  timeoutMs: Number(import.meta.env.VITE_TIMEOUT_MS ?? 60_000),

  apiVersion: 2 as const,

  refreshTokenIntervalMs: Number(import.meta.env.VITE_REFRESH_TOKEN_MS ?? 3_600_000),

  /** Ranking pagination (matches Angular default when server config not stored). */
  defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE ?? 50),
};
