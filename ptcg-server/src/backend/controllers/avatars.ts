import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { Avatar, User } from '../../storage';
import { AvatarInfo } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';

export class Avatars extends Controller {

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

  @Post('/add')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    imageBase64: check().required()
  })
  public async onAdd(res: Response) {
    res.status(403);
    res.send({ error: ApiErrorEnum.OPERATION_NOT_PERMITTED });
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDelete(res: Response) {
    res.status(403);
    res.send({ error: ApiErrorEnum.OPERATION_NOT_PERMITTED });
  }

  @Post('/rename')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onRename(res: Response) {
    res.status(403);
    res.send({ error: ApiErrorEnum.OPERATION_NOT_PERMITTED });
  }

  @Post('/markAsDefault')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onMarkAsDefault(res: Response) {
    res.status(403);
    res.send({ error: ApiErrorEnum.OPERATION_NOT_PERMITTED });
  }



}
