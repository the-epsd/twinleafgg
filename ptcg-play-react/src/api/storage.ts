const TOKEN_KEY = 'token';

export function getStoredToken(): string | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | undefined): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  if (token === undefined || token === '') {
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthTokens(): void {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('ptcg_guest_name');
  }
}
