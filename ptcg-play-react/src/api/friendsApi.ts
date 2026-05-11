import { apiGet, apiPost } from './client';
import type { UserInfo } from 'ptcg-server';

export type FriendRelationStatus = 'pending' | 'accepted' | 'blocked';

export interface FriendInfoDto {
  id: number;
  user: UserInfo;
  friend: UserInfo;
  status: FriendRelationStatus;
  created_at: string;
  updated_at: string;
}

export interface FriendsListResponse {
  ok: boolean;
  friends: FriendInfoDto[];
  users: UserInfo[];
  total: number;
}

export type FriendRequestStatusDto = 'pending' | 'accepted' | 'rejected';

export interface FriendRequestInfoDto {
  id: number;
  sender: UserInfo;
  receiver: UserInfo;
  status: FriendRequestStatusDto;
  created_at: string;
  updated_at: string;
}

export interface FriendRequestsResponse {
  ok: boolean;
  requests: FriendRequestInfoDto[];
  users: UserInfo[];
  total: number;
}

export function getFriendsList(): Promise<FriendsListResponse> {
  return apiGet<FriendsListResponse>('/v1/friends/list');
}

export function getPendingFriendRequests(): Promise<FriendRequestsResponse> {
  return apiGet<FriendRequestsResponse>('/v1/friends/requests/pending');
}

export function getSentFriendRequests(): Promise<FriendRequestsResponse> {
  return apiGet<FriendRequestsResponse>('/v1/friends/requests/sent');
}

export function sendFriendRequest(receiverId: number): Promise<{ ok: boolean | number }> {
  return apiPost<{ ok: boolean | number }>('/v1/friends/request/send', { receiverId });
}

export function acceptFriendRequest(requestId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/request/accept', { requestId });
}

export function rejectFriendRequest(requestId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/request/reject', { requestId });
}

export function cancelFriendRequest(requestId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/request/cancel', { requestId });
}

export function removeFriend(friendId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/remove', { friendId });
}

export function blockFriendUser(userId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/block', { userId });
}

export function unblockFriendUser(userId: number): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/v1/friends/unblock', { userId });
}
