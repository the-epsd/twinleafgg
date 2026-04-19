import { ApiErrorEnum } from 'ptcg-server';
import { appConfig } from '../env/config';
import { ApiError } from './apiError';
import { getStoredToken } from './storage';

let authInvalidHandler: (() => void) | null = null;

export function setAuthInvalidHandler(handler: (() => void) | null): void {
  authInvalidHandler = handler;
}

function getBaseUrl(): string {
  return appConfig.apiUrl;
}

export interface RequestOptions {
  skipAuth?: boolean;
  signal?: AbortSignal;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }
  if (!options.skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Auth-Token'] = token;
    }
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), appConfig.timeoutMs);
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if ((e as Error).name === 'AbortError') {
      const err = new ApiError(undefined, 'Request timeout or aborted');
      err.timeout = true;
      throw err;
    }
    throw new ApiError(undefined, 'Network error');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const err = await ApiError.fromResponse(res);
    if (err.code === ApiErrorEnum.AUTH_TOKEN_INVALID) {
      authInvalidHandler?.();
    }
    throw err;
  }

  return parseJson<T>(res);
}

export function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>('GET', path, undefined, options);
}

export function apiPost<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>('POST', path, body, options);
}

export function apiDelete<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>('DELETE', path, body, options);
}
