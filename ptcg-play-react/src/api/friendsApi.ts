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

export function getSentFriendRequests(): Promise<FriendRequestsResponse> {
  return apiGet<FriendRequestsResponse>('/v1/friends/requests/sent');
}

export function sendFriendRequest(receiverId: number): Promise<{ ok: boolean | number }> {
  return apiPost<{ ok: boolean | number }>('/v1/friends/request/send', { receiverId });
}
