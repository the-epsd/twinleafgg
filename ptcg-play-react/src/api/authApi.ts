import { ApiErrorEnum } from 'ptcg-server';
import { appConfig } from '../env/config';
import { ApiError } from './apiError';
import { apiGet, apiPost } from './client';
import type { LoginResponseBody } from '../types/responses';

export async function guestLoginRequest(name: string): Promise<LoginResponseBody> {
  const res = await apiPost<LoginResponseBody>('/v1/login/guest', { name }, { skipAuth: true });
  assertApiVersion(res.config?.apiVersion);
  return res;
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
