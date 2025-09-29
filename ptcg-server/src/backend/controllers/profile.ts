import { Request, Response } from 'express';
import { FindConditions } from 'typeorm';

import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { MatchInfo } from '../interfaces/profile.interface';
import { Md5 } from '../../utils/md5';
import { User, Match, CustomAvatar } from '../../storage';
import { UserInfo } from '../interfaces/core.interface';
import { config } from '../../config';

// Extend Express Request to include user property
declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

export class Profile extends Controller {

  @Get('/me')
  @AuthToken()
  public async onMe(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId, { relations: ['customAvatar'] });
    if (user === undefined) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }
    const userInfo = this.buildUserInfo(user);
    res.send({ ok: true, user: userInfo });
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10);
    const user = await User.findOne(userId, { relations: ['customAvatar'] });
    if (user === undefined) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }
    const userInfo = this.buildUserInfo(user);
    res.send({ ok: true, user: userInfo });
  }

  @Get('/matchHistory/:userId/:page?/:pageSize?')
  @AuthToken()
  public async onMatchHistory(req: Request, res: Response) {
    const defaultPageSize = config.backend.defaultPageSize;
    const userId: number = parseInt(req.params.userId, 10) || 0;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;

    const where: FindConditions<Match>[] = userId === 0 ? []
      : [{ player1: { id: userId } }, { player2: { id: userId } }];

    const [matchRows, total] = await Match.findAndCount({
      relations: ['player1', 'player2'],
      where,
      order: { created: 'DESC' },
      skip: page * pageSize,
      take: pageSize
    });

    const users: UserInfo[] = [];
    matchRows.forEach(match => {
      [match.player1, match.player2].forEach(player => {
        if (!users.some(u => u.userId === player.id)) {
          users.push(this.buildUserInfo(player));
        }
      });
    });

    const matches: MatchInfo[] = matchRows
      .map(match => ({
        matchId: match.id,
        player1Id: match.player1.id,
        player2Id: match.player2.id,
        ranking1: match.ranking1,
        rankingStake1: match.rankingStake1,
        ranking2: match.ranking2,
        rankingStake2: match.rankingStake2,
        winner: match.winner,
        created: match.created,
        player1Archetype: match.player1Archetype,
        player2Archetype: match.player2Archetype,
        player1DeckName: match.player1DeckName,
        player2DeckName: match.player2DeckName,
        player1DeckId: match.player1DeckId || undefined,
        player2DeckId: match.player2DeckId || undefined
      }));

    res.send({ ok: true, matches, users, total });
  }

  @Post('/changePassword')
  @AuthToken()
  @Validate({
    currentPassword: check().isPassword(),
    newPassword: check().isPassword()
  })
  public async onChangePassword(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { currentPassword: string, newPassword: string } = req.body;
    const user = await User.findOne(userId);

    if (user === undefined || user.password !== Md5.init(body.currentPassword)) {
      res.status(400);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }

    user.password = Md5.init(body.newPassword);
    try {
      await user.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }

    res.send({ ok: true });
  }

  @Post('/changeEmail')
  @AuthToken()
  @Validate({
    email: check().isEmail(),
  })
  public async onChangeEmail(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { email: string } = req.body;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }

    if (user.email === body.email) {
      res.send({ ok: true });
      return;
    }

    if (await User.findOne({ email: body.email })) {
      res.status(400);
      res.send({ error: ApiErrorEnum.REGISTER_EMAIL_EXISTS });
      return;
    }

    try {
      user.email = body.email;
      await user.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.LOGIN_INVALID });
      return;
    }

    res.send({ ok: true });
  }

  @Post('/updateRole')
  @AuthToken()
  @Validate({
    targetUserId: check().isNumber(),
    roleId: check().isNumber()
  })
  public async onUpdateRole(req: Request, res: Response) {
    const adminId: number = req.body.userId;
    const admin = await User.findOne(adminId);

    if (!admin || admin.roleId !== 4) {
      res.status(403);
      res.send({ error: ApiErrorEnum.AUTH_INVALID_PERMISSIONS });
      return;
    }

    const body: { targetUserId: number, roleId: number } = req.body;
    const targetUser = await User.findOne(body.targetUserId);

    if (!targetUser) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    if (![1, 2, 3, 4, 5].includes(body.roleId)) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    try {
      targetUser.roleId = body.roleId;
      await targetUser.save();

      this.core.emit(c => c.onUsersUpdate([targetUser]));

      res.send({ ok: true });
    } catch (error) {
      res.status(500);
      res.send({ error: ApiErrorEnum.SERVER_ERROR });
      return;
    }
  }

  @Post('/updateAvatar')
  @AuthToken()
  @Validate({
    face: check().optional().isString(),
    hair: check().optional().isString(),
    glasses: check().optional().isString(),
    shirt: check().optional().isString(),
    hat: check().optional().isString(),
    accessory: check().optional().isString()
  })
  public async onUpdateAvatar(req: Request, res: Response) {
    const userId: number = req.body.userId;
    let user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    let customAvatar = await CustomAvatar.findOne({ where: { user } });
    if (customAvatar === undefined) {
      customAvatar = new CustomAvatar();
      customAvatar.user = user;
    }

    const { face, hair, glasses, shirt, hat, accessory } = req.body;
    if (face) customAvatar.face = face;
    if (hair) customAvatar.hair = hair;
    if (glasses) customAvatar.glasses = glasses;
    if (shirt) customAvatar.shirt = shirt;
    if (hat) customAvatar.hat = hat;
    if (accessory) customAvatar.accessory = accessory;

    await customAvatar.save();

    // Re-fetch the user to get the eagerly-loaded customAvatar relation
    user = await User.findOne(userId, { relations: ['customAvatar'] });

    if (!user) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const userInfo = this.buildUserInfo(user);
    res.send({ ok: true, user: userInfo });
  }
}
