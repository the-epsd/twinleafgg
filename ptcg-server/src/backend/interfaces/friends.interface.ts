import { UserInfo } from './core.interface';
import { FriendStatus } from '../../storage/model/friend';
import { FriendRequestStatus } from '../../storage/model/friend-request';

export interface FriendInfo {
  id: number;
  user: UserInfo;
  friend: UserInfo;
  status: FriendStatus;
  created_at: Date;
  updated_at: Date;
}

export interface FriendRequestInfo {
  id: number;
  sender: UserInfo;
  receiver: UserInfo;
  status: FriendRequestStatus;
  created_at: Date;
  updated_at: Date;
}

export interface FriendsListResponse {
  ok: boolean;
  friends: FriendInfo[];
  users: UserInfo[];
  total: number;
}

export interface FriendRequestsResponse {
  ok: boolean;
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