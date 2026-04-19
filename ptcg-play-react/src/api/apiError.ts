import { ApiErrorEnum } from 'ptcg-server';

export class ApiError extends Error {
  code?: ApiErrorEnum;
  timeout = false;
  handled = false;

  constructor(code?: ApiErrorEnum, message?: string, name?: string) {
    super(message ?? String(code ?? 'Error'));
    this.name = name ?? 'ApiError';
    this.code = code;
  }

  static fromBody(body: unknown): ApiError | null {
    if (body && typeof body === 'object' && 'error' in body) {
      const code = (body as { error: ApiErrorEnum }).error;
      return new ApiError(code, String(code));
    }
    return null;
  }

  static async fromResponse(res: Response): Promise<ApiError> {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const api = body ? ApiError.fromBody(body) : null;
    if (api) {
      return api;
    }
    return new ApiError(undefined, `HTTP ${res.status}`, res.statusText);
  }
}

export function formatUnknownError(e: unknown): string {
  if (e instanceof ApiError) {
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  if (e && typeof e === 'object' && 'message' in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === 'string') {
      return m;
    }
  }
  if (typeof e === 'string') {
    return e;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
