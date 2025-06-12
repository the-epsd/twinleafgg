import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Avatar, User } from '../../storage';
import { AvatarInfo } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';

export class Avatars extends Controller {

  @Get('/predefined')
  @AuthToken()
  public async onGetPredefined(req: Request, res: Response) {
    const predefinedAvatars: AvatarInfo[] = [
      { id: 2, name: 'gg', fileName: 'av_1.png' },
      { id: 3, name: 'um', fileName: 'av_2.png' },
      { id: 4, name: 'gr', fileName: 'av_3.png' },
    ];

    res.send({ ok: true, avatars: predefinedAvatars });
  }

  @Get('/list/:id?')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10) || req.body.userId;
    const user = await User.findOne(userId, { relations: ['avatars'] });

    if (user === undefined) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const avatars: AvatarInfo[] = user.avatars.map(avatar => ({
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }));

    res.send({ ok: true, avatars });
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const avatarId: number = parseInt(req.params.id, 10);
    const avatar = await Avatar.findOne(avatarId);
    if (avatar === undefined) {
      res.send({ error: ApiErrorEnum.AVATAR_INVALID });
      return;
    }
    const avatarInfo: AvatarInfo = {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    };
    res.send({ ok: true, avatar: avatarInfo });
  }

  @Post('/find')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32)
  })
  public async onFind(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const avatars = await Avatar.find({
      where: { user: { id: body.id }, name: body.name.trim() }
    });

    if (avatars.length !== 1) {
      res.send({ error: ApiErrorEnum.AVATAR_INVALID });
      return;
    }
    const avatar = avatars[0];
    const avatarInfo: AvatarInfo = {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    };
    res.send({ ok: true, avatar: avatarInfo });
  }

  @Post('/markAsDefault')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onMarkAsDefault(req: Request, res: Response) {
    const body: { id: number } = req.body;
    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    // For predefined avatars, we just update the user's avatarFile
    if (body.id <= 10) { // Predefined avatars have IDs 1-10
      try {
        user.avatarFile = `predefined_${body.id}.png`;
        const savedUser = await user.save();
        if (savedUser) {
          this.core.emit(c => c.onUsersUpdate([savedUser]));
        }
        res.send({ ok: true });
        return;
      } catch (error) {
        res.status(400);
        res.send({ error: ApiErrorEnum.AVATAR_INVALID });
        return;
      }
    }

    // For user avatars, we need to check ownership
    const avatar = await Avatar.findOne(body.id, { relations: ['user'] });
    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.AVATAR_INVALID });
      return;
    }

    if (user.avatarFile === avatar.fileName) {
      res.send({ ok: true });
      return;
    }

    try {
      user.avatarFile = avatar.fileName;
      const savedUser = await user.save();
      if (savedUser) {
        this.core.emit(c => c.onUsersUpdate([savedUser]));
      }
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.AVATAR_INVALID });
      return;
    }

    res.send({ ok: true });
  }
}