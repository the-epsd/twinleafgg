import { Request, Response } from 'express';
import { generateToken } from '../services';
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
    const baseName = this.normalizeGuestName(requestedName);
    let name = baseName;
    let user = await User.findOne({ where: { name } });

    if (user !== undefined && !this.isUserConnected(user)) {
      await user.updateLastSeen();
      const token = generateToken(user.id);
      res.send({
        ok: true,
        token,
        config: this.getServerConfig(),
        user: this.buildUserInfo(user)
      });
      return;
    }

    for (let attempt = 0; attempt < 4; attempt++) {
      if (user !== undefined && this.isUserConnected(user)) {
        name = this.nameWithCollisionSuffix(baseName, attempt + 1);
        user = await User.findOne({ where: { name } });
        if (user !== undefined && !this.isUserConnected(user)) {
          await user.updateLastSeen();
          break;
        }
        if (user !== undefined) {
          continue;
        }
      }
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
          name = this.nameWithCollisionSuffix(baseName, attempt + 1);
        }
      }
      if (user !== undefined) {
        break;
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
      board3dWhitelist: board3dWhitelist
    };
  }

  private normalizeGuestName(name: string): string {
    const cleaned = name.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    if (cleaned.length >= 2) {
      return cleaned;
    }
    return `Guest-${Math.random().toString(36).slice(2, 10)}`;
  }

  private nameWithCollisionSuffix(name: string, attempt: number): string {
    const suffix = `-${Math.random().toString(36).slice(2, 6) || attempt}`;
    return `${name.slice(0, Math.max(1, 40 - suffix.length))}${suffix}`;
  }

  private isUserConnected(user: User): boolean {
    return this.core.clients.some(client => client.user.id === user.id);
  }

}
