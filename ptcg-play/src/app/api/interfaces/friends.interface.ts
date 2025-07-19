import { Response } from './response.interface';
import { UserInfo } from 'ptcg-server';

export interface FriendInfo {
  id: number;
  user: UserInfo;
  friend: UserInfo;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: Date;
  updated_at: Date;
}

export interface FriendRequestInfo {
  id: number;
  sender: UserInfo;
  receiver: UserInfo;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface FriendsListResponse extends Response {
  friends: FriendInfo[];
  users: UserInfo[];
  total: number;
}

export interface FriendRequestsResponse extends Response {
  requests: FriendRequestInfo[];
  users: UserInfo[];
  total: number;
}

export interface SendFriendRequestRequest {
  receiverId: number;
}

export interface AcceptFriendRequestRequest {
  requestId: number;
}

export interface RejectFriendRequestRequest {
  requestId: number;
}

export interface CancelFriendRequestRequest {
  requestId: number;
}

export interface RemoveFriendRequest {
  friendId: number;
}

export interface BlockUserRequest {
  userId: number;
}

export interface UnblockUserRequest {
  userId: number;
} 