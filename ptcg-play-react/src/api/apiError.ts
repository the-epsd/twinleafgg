import { ApiErrorEnum } from 'ptcg-server';
import type { TFunction } from 'i18next';

export class ApiError extends Error {
  code?: ApiErrorEnum;
  timeout = false;
  handled = false;
  param?: string;

  constructor(code?: ApiErrorEnum, message?: string, name?: string) {
    super(message ?? String(code ?? 'Error'));
    this.name = name ?? 'ApiError';
    this.code = code;
  }

  static fromBody(body: unknown): ApiError | null {
    if (body && typeof body === 'object' && 'error' in body) {
      const payload = body as { error: ApiErrorEnum; param?: string };
      const api = new ApiError(payload.error, String(payload.error));
      api.param = payload.param;
      return api;
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

export function formatRegisterError(error: ApiError, t: TFunction): string {
  switch (error.code) {
    case ApiErrorEnum.REGISTER_NAME_EXISTS:
      return t('REGISTER_NAME_TAKEN');
    case ApiErrorEnum.REGISTER_EMAIL_EXISTS:
      return t('REGISTER_EMAIL_TAKEN');
    case ApiErrorEnum.REGISTER_DISABLED:
      return t('REGISTER_DISABLED');
    case ApiErrorEnum.REGISTER_INVALID_SERVER_PASSWORD:
      return t('REGISTER_INVALID_SERVER_PASSWORD');
    case ApiErrorEnum.REQUESTS_LIMIT_REACHED:
      return t('ERROR_REQUESTS_LIMIT_REACHED');
    case ApiErrorEnum.VALIDATION_INVALID_PARAM:
      switch (error.param) {
        case 'name':
          return t('VALIDATION_INVALID_NAME_FORMAT');
        case 'email':
          return t('VALIDATION_INVALID_EMAIL_FORMAT');
        case 'password':
          return t('VALIDATION_INVALID_PASSWORD_FORMAT');
        default:
          return t('ERROR_INVALID_REQUEST');
      }
    default:
      return t('REACT_ERROR_REGISTER_FAILED');
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
