import { Request, Response } from 'express';
import { AuthToken, generateToken } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { ServerConfig } from '../interfaces';
import { User } from '../../storage';
import { config } from '../../config';
import { board3dWhitelist } from '../../config/3d-board-whitelist';


export class Login extends Controller {

  @Post('/guest')
  public async onGuest(req: Request, res: Response) {
    const requestedName = typeof req.body?.name === 'string' ? req.body.name : '';
    let name = this.normalizeGuestName(requestedName);
    let user = await User.findOne({ where: { name } });

    for (let attempt = 0; user === undefined && attempt < 4; attempt++) {
      const guest = new User();
      guest.name = name;
      guest.email = `${name.toLowerCase()}@guest.local`;
      guest.password = '';
      guest.registered = Date.now();
      guest.lastSeen = Date.now();
      try {
        user = await guest.save();
      } catch (error) {
        user = await User.findOne({ where: { name } });
        if (user === undefined) {
          name = this.normalizeGuestName('');
        }
      }
    }

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }

    const token = generateToken(user.id);
    res.send({
      ok: true,
      token,
      config: this.getServerConfig(),
      user: this.buildUserInfo(user)
    });
  }

  @Get('/refreshToken')
  @AuthToken()
  public async onRefreshToken(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });
    if (user === undefined) {
      res.status(401);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }
    const token = generateToken(userId);
    res.send({ ok: true, token, config: this.getServerConfig(), user: this.buildUserInfo(user) });
  }

  @Get('/info')
  public onInfo(req: Request, res: Response) {
    res.send({ ok: true, config: this.getServerConfig() });
  }

  private getServerConfig(): ServerConfig {
    return {
      apiVersion: 2,
      defaultPageSize: config.backend.defaultPageSize,
      scansUrl: config.sets.scansUrl,
      replayFileSize: config.backend.replayFileSize,
      refreshTokenInterval: config.backend.refreshTokenInterval,
      board3dWhitelist: board3dWhitelist
    };
  }

  private normalizeGuestName(name: string): string {
    const cleaned = name.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    if (cleaned.length >= 8 && cleaned.startsWith('Guest-')) {
      return cleaned;
    }
    return `Guest-${Math.random().toString(36).slice(2, 10)}`;
  }

}
