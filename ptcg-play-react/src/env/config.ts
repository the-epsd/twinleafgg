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

  showFormatUi: import.meta.env.VITE_SHOW_FORMAT_UI === 'true',
};
