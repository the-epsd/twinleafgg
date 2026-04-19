import { normalizeDevLocalApiUrl } from '../env/normalizeApiUrl';

const TOKEN_KEY = 'token';
const API_URL_KEY = 'apiUrl';
const SESSION_ONLY_KEY = 'ptcg_prefer_session_only';

function isSessionOnlyPreferred(): boolean {
  if (typeof sessionStorage === 'undefined') {
    return false;
  }
  return sessionStorage.getItem(SESSION_ONLY_KEY) === '1';
}

/** When true, auth token is kept in sessionStorage (cleared when the tab closes). */
export function setPreferSessionOnly(value: boolean): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  if (value) {
    sessionStorage.setItem(SESSION_ONLY_KEY, '1');
  } else {
    sessionStorage.removeItem(SESSION_ONLY_KEY);
  }
}

export function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  if (isSessionOnlyPreferred() && typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | undefined): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const sess = isSessionOnlyPreferred();
  const clearBoth = () => {
    localStorage.removeItem(TOKEN_KEY);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  };
  if (token === undefined || token === '') {
    clearBoth();
    return;
  }
  if (sess && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }
}

export function clearAuthTokens(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_ONLY_KEY);
  }
}

export function getStoredApiUrlOverride(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(API_URL_KEY);
  if (!raw) {
    return null;
  }
  return normalizeDevLocalApiUrl(raw);
}

export function setStoredApiUrlOverride(url: string | undefined): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  if (url === undefined || url === '') {
    localStorage.removeItem(API_URL_KEY);
    return;
  }
  const normalized = normalizeDevLocalApiUrl(url);
  localStorage.setItem(API_URL_KEY, normalized);
}
