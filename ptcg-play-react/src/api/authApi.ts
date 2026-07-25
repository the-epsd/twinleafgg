import { ApiErrorEnum } from 'ptcg-server';
import type { ServerConfig } from 'ptcg-server';
import { appConfig } from '../env/config';
import { ApiError } from './apiError';
import { apiGet, apiPost } from './client';
import type { LoginResponseBody, OkResponse } from '../types/responses';

export async function loginRequest(name: string, password: string): Promise<LoginResponseBody> {
  const res = await apiPost<LoginResponseBody>('/v1/login', { name, password }, { skipAuth: true });
  assertApiVersion(res.config?.apiVersion);
  return res;
}

export async function fetchLoginInfo(): Promise<ServerConfig> {
  const res = await apiGet<OkResponse & { config: ServerConfig }>('/v1/login/info', { skipAuth: true });
  assertApiVersion(res.config?.apiVersion);
  return res.config;
}

export async function registerRequest(
  name: string,
  password: string,
  email: string,
  serverPassword?: string
): Promise<void> {
  await apiPost('/v1/login/register', { name, password, email, serverPassword }, { skipAuth: true });
}

export async function refreshTokenRequest(): Promise<LoginResponseBody> {
  const res = await apiGet<LoginResponseBody>('/v1/login/refreshToken');
  assertApiVersion(res.config?.apiVersion);
  return res;
}

function assertApiVersion(version: number | undefined): void {
  if (version !== appConfig.apiVersion) {
    throw new ApiError(ApiErrorEnum.UNSUPPORTED_VERSION, ApiErrorEnum.UNSUPPORTED_VERSION);
  }
}
