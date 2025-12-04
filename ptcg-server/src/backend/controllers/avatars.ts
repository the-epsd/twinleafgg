import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Avatar, User, UserUnlockedItem } from '../../storage';
import { AvatarInfo } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';

export class Avatars extends Controller {

  @Get('/available')
  @AuthToken()
  public async onGetAvailable(req: Request, res: Response) {
    const userId: number = req.body.userId;

    // Standard predefined avatars
    const predefinedAvatars: AvatarInfo[] = [
      { id: 2, name: 'gg', fileName: 'predefined_2.png' },
      { id: 3, name: 'um', fileName: 'predefined_3.png' },
      { id: 4, name: 'gr', fileName: 'predefined_4.png' },
      { id: 5, name: 'gd', fileName: 'predefined_5.png' },
    ];

    // Avatars unlocked from battle pass, etc.
    const unlockedItems = await UserUnlockedItem.find({ where: { userId, itemType: 'avatar' } });

    const unlockedAvatars: AvatarInfo[] = unlockedItems.map(item => {
      // You might want a more robust way to map itemId to avatar details
      return {
        id: 0, // These don't have a real ID in the avatars table
        name: this.getAvatarNameFromId(item.itemId),
        fileName: this.getAvatarFileNameFromId(item.itemId)
      };
    });

    res.send({ ok: true, avatars: [...predefinedAvatars, ...unlockedAvatars] });
  }

  private getAvatarNameFromId(itemId: string): string {
    // Example: 'avatar_spring_lord' -> 'Spring Lord'
    return itemId.replace('avatar_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getAvatarFileNameFromId(itemId: string): string {
    // This is a placeholder. In a real system, you might have a mapping
    // or a consistent naming convention.
    const map: { [key: string]: string } = {
      'avatar_spring_lord': 'av_5.png',
      'avatar_shadow_rider': 'av_4.png',
      'avatar_pao': 'pao.webp'
    };
    return map[itemId] || 'av_default.png';
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