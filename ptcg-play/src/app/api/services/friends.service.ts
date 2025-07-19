import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';
import {
  FriendsListResponse,
  FriendRequestsResponse,
  SendFriendRequestRequest,
  AcceptFriendRequestRequest,
  RejectFriendRequestRequest,
  CancelFriendRequestRequest,
  RemoveFriendRequest,
  BlockUserRequest,
  UnblockUserRequest
} from '../interfaces/friends.interface';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class FriendsService {

  constructor(
    private api: ApiService,
  ) { }

  public getFriendsList(): Observable<FriendsListResponse> {
    return this.api.get<FriendsListResponse>('/v1/friends/list');
  }

  public getPendingRequests(): Observable<FriendRequestsResponse> {
    return this.api.get<FriendRequestsResponse>('/v1/friends/requests/pending');
  }

  public getSentRequests(): Observable<FriendRequestsResponse> {
    return this.api.get<FriendRequestsResponse>('/v1/friends/requests/sent');
  }

  public sendFriendRequest(receiverId: number): Observable<Response> {
    const request: SendFriendRequestRequest = { receiverId };
    return this.api.post<Response>('/v1/friends/request/send', request);
  }

  public acceptFriendRequest(requestId: number): Observable<Response> {
    const request: AcceptFriendRequestRequest = { requestId };
    return this.api.post<Response>('/v1/friends/request/accept', request);
  }

  public rejectFriendRequest(requestId: number): Observable<Response> {
    const request: RejectFriendRequestRequest = { requestId };
    return this.api.post<Response>('/v1/friends/request/reject', request);
  }

  public cancelFriendRequest(requestId: number): Observable<Response> {
    const request: CancelFriendRequestRequest = { requestId };
    return this.api.post<Response>('/v1/friends/request/cancel', request);
  }

  public removeFriend(friendId: number): Observable<Response> {
    const request: RemoveFriendRequest = { friendId };
    return this.api.post<Response>('/v1/friends/remove', request);
  }

  public blockUser(userId: number): Observable<Response> {
    const request: BlockUserRequest = { userId };
    return this.api.post<Response>('/v1/friends/block', request);
  }

  public unblockUser(userId: number): Observable<Response> {
    const request: UnblockUserRequest = { userId };
    return this.api.post<Response>('/v1/friends/unblock', request);
  }
} 