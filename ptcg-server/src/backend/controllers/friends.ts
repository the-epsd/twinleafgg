import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { User, Friend, FriendRequest, FriendStatus, FriendRequestStatus } from '../../storage';
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

export class Friends extends Controller {

  @Get('/list')
  @AuthToken()
  public async onGetFriendsList(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const friends = await Friend.getFriendsList(userId);

    const users: any[] = [];
    const friendsList: any[] = [];

    friends.forEach(friend => {
      // Add safety checks
      if (!friend.user || !friend.friend) {
        console.error('Friend relations not loaded:', friend);
        return; // Skip this friend
      }

      const otherUser = friend.user_id === userId ? friend.friend : friend.user;
      const currentUser = friend.user_id === userId ? friend.user : friend.friend;

      if (!users.some(u => u.userId === otherUser.id)) {
        users.push(this.buildUserInfo(otherUser));
      }
      if (!users.some(u => u.userId === currentUser.id)) {
        users.push(this.buildUserInfo(currentUser));
      }

      friendsList.push({
        id: friend.id,
        user: this.buildUserInfo(currentUser),
        friend: this.buildUserInfo(otherUser),
        status: friend.status,
        created_at: friend.created_at,
        updated_at: friend.updated_at
      });
    });

    const response: FriendsListResponse = {
      ok: true,
      friends: friendsList,
      users,
      total: friendsList.length
    };

    res.send(response);
  }

  @Get('/requests/pending')
  @AuthToken()
  public async onGetPendingRequests(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const requests = await FriendRequest.getPendingRequests(userId);

    const users: any[] = [];
    const requestsList: any[] = [];

    requests.forEach(request => {
      if (!users.some(u => u.userId === request.sender.id)) {
        users.push(this.buildUserInfo(request.sender));
      }
      if (!users.some(u => u.userId === request.receiver.id)) {
        users.push(this.buildUserInfo(request.receiver));
      }

      requestsList.push({
        id: request.id,
        sender: this.buildUserInfo(request.sender),
        receiver: this.buildUserInfo(request.receiver),
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      });
    });

    const response: FriendRequestsResponse = {
      ok: true,
      requests: requestsList,
      users,
      total: requestsList.length
    };

    res.send(response);
  }

  @Get('/requests/sent')
  @AuthToken()
  public async onGetSentRequests(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const requests = await FriendRequest.getSentRequests(userId);

    const users: any[] = [];
    const requestsList: any[] = [];

    requests.forEach(request => {
      if (!users.some(u => u.userId === request.sender.id)) {
        users.push(this.buildUserInfo(request.sender));
      }
      if (!users.some(u => u.userId === request.receiver.id)) {
        users.push(this.buildUserInfo(request.receiver));
      }

      requestsList.push({
        id: request.id,
        sender: this.buildUserInfo(request.sender),
        receiver: this.buildUserInfo(request.receiver),
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      });
    });

    const response: FriendRequestsResponse = {
      ok: true,
      requests: requestsList,
      users,
      total: requestsList.length
    };

    res.send(response);
  }

  @Post('/request/send')
  @AuthToken()
  @Validate({
    receiverId: check().isNumber()
  })
  public async onSendFriendRequest(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: SendFriendRequestRequest = req.body;

    if (userId === body.receiverId) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    const receiver = await User.findOne(body.receiverId);
    if (!receiver) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findFriendship(userId, body.receiverId);
    if (existingFriendship) {
      res.status(400);
      res.send({ error: 'Friendship already exists' });
      return;
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findRequest(userId, body.receiverId);
    if (existingRequest) {
      res.status(400);
      res.send({ error: 'Friend request already sent' });
      return;
    }

    const request = new FriendRequest();
    request.sender_id = userId;
    request.receiver_id = body.receiverId;
    request.status = FriendRequestStatus.PENDING;
    await request.save();

    res.send({ ok: true });
  }

  @Post('/request/accept')
  @AuthToken()
  @Validate({
    requestId: check().isNumber()
  })
  public async onAcceptFriendRequest(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: AcceptFriendRequestRequest = req.body;

    const request = await FriendRequest.findOne({
      where: { id: body.requestId, receiver_id: userId, status: FriendRequestStatus.PENDING },
      relations: ['sender', 'receiver']
    });

    if (!request) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    // Update request status
    request.status = FriendRequestStatus.ACCEPTED;
    await request.save();

    // Create friendship
    const friendship = new Friend();
    friendship.user_id = request.sender_id;
    friendship.friend_id = request.receiver_id;
    friendship.status = FriendStatus.ACCEPTED;
    await friendship.save();

    res.send({ ok: true });
  }

  @Post('/request/reject')
  @AuthToken()
  @Validate({
    requestId: check().isNumber()
  })
  public async onRejectFriendRequest(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: RejectFriendRequestRequest = req.body;

    const request = await FriendRequest.findOne({
      where: { id: body.requestId, receiver_id: userId, status: FriendRequestStatus.PENDING }
    });

    if (!request) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    request.status = FriendRequestStatus.REJECTED;
    await request.save();

    res.send({ ok: true });
  }

  @Post('/request/cancel')
  @AuthToken()
  @Validate({
    requestId: check().isNumber()
  })
  public async onCancelFriendRequest(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: CancelFriendRequestRequest = req.body;

    const request = await FriendRequest.findOne({
      where: { id: body.requestId, sender_id: userId, status: FriendRequestStatus.PENDING }
    });

    if (!request) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    await request.remove();

    res.send({ ok: true });
  }

  @Post('/remove')
  @AuthToken()
  @Validate({
    friendId: check().isNumber()
  })
  public async onRemoveFriend(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: RemoveFriendRequest = req.body;

    const friendship = await Friend.findFriendship(userId, body.friendId);
    if (!friendship || friendship.status !== FriendStatus.ACCEPTED) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    await friendship.remove();

    res.send({ ok: true });
  }

  @Post('/block')
  @AuthToken()
  @Validate({
    userId: check().isNumber()
  })
  public async onBlockUser(req: Request, res: Response) {
    const currentUserId: number = req.body.userId;
    const body: BlockUserRequest = req.body;

    if (currentUserId === body.userId) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    const targetUser = await User.findOne(body.userId);
    if (!targetUser) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    // Check if friendship exists and update to blocked
    let friendship = await Friend.findFriendship(currentUserId, body.userId);
    if (friendship) {
      friendship.status = FriendStatus.BLOCKED;
      await friendship.save();
    } else {
      // Create new blocked friendship
      friendship = new Friend();
      friendship.user_id = currentUserId;
      friendship.friend_id = body.userId;
      friendship.status = FriendStatus.BLOCKED;
      await friendship.save();
    }

    res.send({ ok: true });
  }

  @Post('/unblock')
  @AuthToken()
  @Validate({
    userId: check().isNumber()
  })
  public async onUnblockUser(req: Request, res: Response) {
    const currentUserId: number = req.body.userId;
    const body: UnblockUserRequest = req.body;

    const friendship = await Friend.findFriendship(currentUserId, body.userId);
    if (!friendship || friendship.status !== FriendStatus.BLOCKED) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    await friendship.remove();

    res.send({ ok: true });
  }
} 