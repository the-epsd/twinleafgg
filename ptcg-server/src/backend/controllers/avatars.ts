import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Avatar, AvatarCatalog, User, UserUnlockedItem } from '../../storage';
import { AvatarInfo } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { In } from 'typeorm';

export class Avatars extends Controller {

  @Get('/available')
  @AuthToken()
  public async onGetAvailable(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const defaults = await AvatarCatalog.find({
      where: { isDefault: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    const unlockedItems = await UserUnlockedItem.find({ where: { userId, itemType: 'avatar' } });
    const unlockedIds = unlockedItems.map(item => item.itemId);
    const unlockedCatalog = unlockedIds.length
      ? await AvatarCatalog.find({ where: { identifier: In(unlockedIds) } })
      : [];

    const byIdentifier = new Map<string, AvatarCatalog>();
    for (const avatar of [...defaults, ...unlockedCatalog]) {
      byIdentifier.set(avatar.identifier, avatar);
    }

    const avatars: AvatarInfo[] = Array.from(byIdentifier.values()).map(avatar => ({
      id: avatar.isDefault ? this.predefinedIdFromIdentifier(avatar.identifier) : 0,
      name: avatar.name,
      fileName: avatar.fileName,
    }));

    res.send({ ok: true, avatars });
  }

  private predefinedIdFromIdentifier(identifier: string): number {
    const match = /^predefined_(\d+)$/.exec(identifier);
    return match ? parseInt(match[1], 10) : 0;
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
    id: check().isNumber(),
    fileName: check().optional().isString()
  })
  public async onMarkAsDefault(req: Request, res: Response) {
    const body: { id: number, fileName?: string } = req.body;
    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    if (body.id === 0) {
      if (!body.fileName) {
        res.status(400);
        res.send({ error: ApiErrorEnum.AVATAR_INVALID });
        return;
      }

      const unlockedItems = await UserUnlockedItem.find({ where: { userId, itemType: 'avatar' } });
      const unlockedIds = unlockedItems.map(item => item.itemId);
      const catalogMatches = unlockedIds.length
        ? await AvatarCatalog.find({ where: { identifier: In(unlockedIds), fileName: body.fileName } })
        : [];

      if (catalogMatches.length === 0) {
        res.status(400);
        res.send({ error: ApiErrorEnum.AVATAR_INVALID });
        return;
      }

      if (user.avatarFile === body.fileName) {
        res.send({ ok: true });
        return;
      }

      try {
        user.avatarFile = body.fileName;
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

    if (body.id <= 10) {
      try {
        const fileName = `predefined_${body.id}.png`;
        const catalog = await AvatarCatalog.findOne({ where: { identifier: `predefined_${body.id}` } });
        user.avatarFile = catalog?.fileName || fileName;
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
