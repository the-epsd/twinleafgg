import { Request, Response } from 'express';
import { AuthToken } from '../services/auth-token';
import { Controller, Get } from './controller';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';

export class Users extends Controller {
  constructor(path: string, app: any, storage: Storage, core: Core) {
    super(path, app, storage, core);
  }

  @Get('/online')
  @AuthToken()
  public async getOnlineUsers(req: Request, res: Response): Promise<void> {
    try {
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

      const onlineUsers = await this.db.manager
        .createQueryBuilder()
        .select(['id', 'name as username', 'avatarFile as avatar'])
        .from('user', 'user')
        .where('lastSeen > :fiveMinutesAgo', { fiveMinutesAgo })
        .getRawMany();

      res.json(onlineUsers.map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar || 'assets/avatar.svg',
        status: 'online'
      })));
    } catch (error) {
      console.error('Error getting online users:', error);
      res.status(500).json({ error: 'Failed to get online users' });
    }
  }
} 