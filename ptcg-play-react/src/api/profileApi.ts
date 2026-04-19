import { apiGet, apiPost } from './client';
import type { MatchHistoryResponse, ProfileJsonUrlResponse, ProfileResponse } from '../types/responses';

export function getProfileMe(): Promise<ProfileResponse> {
  return apiGet<ProfileResponse>('/v1/profile/me');
}

export function getProfileById(userId: number): Promise<ProfileResponse> {
  return apiGet<ProfileResponse>(`/v1/profile/get/${userId}`);
}

export function getMatchHistory(userId: number, page: number): Promise<MatchHistoryResponse> {
  return apiGet<MatchHistoryResponse>(`/v1/profile/matchHistory/${userId}/${page}`);
}

export function updateUserRole(targetUserId: number, roleId: number): Promise<{ ok: boolean | number }> {
  return apiPost<{ ok: boolean | number }>('/v1/profile/updateRole', { targetUserId, roleId });
}

export function getCardImagesUrl(): Promise<ProfileJsonUrlResponse> {
  return apiGet<ProfileJsonUrlResponse>('/v1/profile/cardImagesUrl');
}

export function getNightlyImagesUrl(): Promise<ProfileJsonUrlResponse> {
  return apiGet<ProfileJsonUrlResponse>('/v1/profile/nightlyImagesUrl');
}
