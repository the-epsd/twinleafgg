import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
import { Controller, Get, Post, Delete } from './controller';
import { AuthToken } from '../services/auth-token';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

export class Friends extends Controller {
  constructor(
    path: string,
    app: Application,
    db: Storage,
    core: Core
  ) {
    super(path, app, db, core);
  }

  @Get('/')
  @AuthToken()
  public async getFriends(req: Request, res: Response) {
    try {
      const connection = getConnection();
      const friends = await connection.query(`
        SELECT DISTINCT 
          u.id, 
          u.name as username, 
          u.avatarFile as avatar,
          CASE 
            WHEN u.lastActivity > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online'
            ELSE 'offline'
          END as status
        FROM friends f
        JOIN user u ON (
          (f.friend_id = u.id AND f.user_id = ?) OR 
          (f.user_id = u.id AND f.friend_id = ?)
        )
        WHERE f.status = 'accepted'
        ORDER BY u.name ASC
      `, [req.body.userId, req.body.userId]);
      res.json(friends);
    } catch (error) {
      console.error('Error getting friends:', error);
      res.status(500).json({ error: 'Failed to get friends list' });
    }
  }

  @Get('/requests')
  @AuthToken()
  public async getFriendRequests(req: Request, res: Response) {
    try {
      const connection = getConnection();
      const requests = await connection.query(`
        SELECT 
          fr.id,
          fr.sender_id,
          fr.receiver_id,
          fr.status,
          sender.name as sender_name,
          sender.avatarFile as sender_avatar,
          receiver.name as receiver_name,
          receiver.avatarFile as receiver_avatar
        FROM friend_requests fr
        JOIN user sender ON fr.sender_id = sender.id
        JOIN user receiver ON fr.receiver_id = receiver.id
        WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'pending'
      `, [req.body.userId, req.body.userId]);

      console.log('Raw friend requests from DB:', requests);

      // Transform the response to match what the client expects
      const transformedRequests = requests.map((request: {
        id: number;
        sender_id: number;
        receiver_id: number;
        status: string;
        sender_name: string;
        sender_avatar: string;
        receiver_name: string;
        receiver_avatar: string;
      }) => {
        const isSent = request.sender_id === req.body.userId;
        return {
          id: request.id,
          username: isSent ? request.receiver_name : request.sender_name,
          avatar: isSent ? request.receiver_avatar : request.sender_avatar,
          status: request.status,
          isSent
        };
      });

      console.log('Transformed friend requests:', transformedRequests);
      res.json(transformedRequests);
    } catch (error) {
      console.error('Error getting friend requests:', error);
      res.status(500).json({ error: 'Failed to get friend requests' });
    }
  }

  @Post('/accept/:id')
  @AuthToken()
  public async acceptFriendRequest(req: Request, res: Response) {
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ error: 'Invalid request ID' });
      }

      const connection = getConnection();

      // First, get the friend request details
      const [request] = await connection.query(`
        SELECT sender_id, receiver_id
        FROM friend_requests
        WHERE id = ? AND status = 'pending'
      `, [requestId]);

      if (!request) {
        return res.status(404).json({ error: 'Friend request not found' });
      }

      const { sender_id, receiver_id } = request;

      // Update the friend request status
      await connection.query(`
        UPDATE friend_requests
        SET status = 'accepted'
        WHERE id = ?
      `, [requestId]);

      // Add the friendship in both directions
      await connection.query(`
        INSERT INTO friends (user_id, friend_id, status)
        VALUES (?, ?, 'accepted'), (?, ?, 'accepted')
      `, [sender_id, receiver_id, receiver_id, sender_id]);

      res.json({ success: true });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ error: 'Failed to accept friend request' });
    }
  }

  @Post('/reject/:id')
  @AuthToken()
  public async rejectFriendRequest(req: Request, res: Response) {
    try {
      const friendId = parseInt(req.params.id);
      if (isNaN(friendId)) {
        return res.status(400).json({ error: 'Invalid friend ID' });
      }

      const connection = getConnection();
      await connection.query(`
        UPDATE friend_requests
        SET status = 'rejected'
        WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
      `, [friendId, req.body.userId]);

      res.json({ success: true });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ error: 'Failed to reject friend request' });
    }
  }

  @Post('/request/:id')
  @AuthToken()
  public async sendFriendRequest(req: Request, res: Response) {
    try {
      const friendId = parseInt(req.params.id);
      if (isNaN(friendId)) {
        return res.status(400).json({ error: 'Invalid friend ID' });
      }

      const connection = getConnection();
      await connection.query(`
        INSERT INTO friend_requests (sender_id, receiver_id, status)
        VALUES (?, ?, 'pending')
      `, [req.body.userId, friendId]);

      res.json({ success: true });
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ error: 'Failed to send friend request' });
    }
  }

  @Delete('/:id')
  @AuthToken()
  public async removeFriend(req: Request, res: Response) {
    try {
      const friendId = parseInt(req.params.id);
      if (isNaN(friendId)) {
        return res.status(400).json({ error: 'Invalid friend ID' });
      }

      const connection = getConnection();
      await connection.query(`
        DELETE FROM friends
        WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
      `, [req.body.userId, friendId, friendId, req.body.userId]);

      res.json({ success: true });
    } catch (error) {
      console.error('Error removing friend:', error);
      res.status(500).json({ error: 'Failed to remove friend' });
    }
  }
} 