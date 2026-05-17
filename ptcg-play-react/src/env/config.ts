import { normalizeDevLocalApiUrl } from './normalizeApiUrl';

export const appConfig = {
  get apiUrl(): string {
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

  /** Ranking pagination fallback when server config is not stored. */
  defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE ?? 50),
};
