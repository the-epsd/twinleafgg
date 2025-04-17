import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';

import { SleeveInfo } from '../interfaces/sleeve.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { User } from '../../storage';
import { Sleeve } from '../../storage/model/sleeve';

export class Sleeves extends Controller {
  @Get('/predefined')
  @AuthToken()
  public async onGetPredefined(req: Request, res: Response) {
    const predefinedSleeves: SleeveInfo[] = [
      { id: 1, name: 'Default', fileName: 'cardback.png' },
      { id: 2, name: 'New', fileName: 'cardback_2.png' },
    ];

    res.send({ ok: true, sleeves: predefinedSleeves });
  }

  @Get('/list/:id?')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10) || req.body.userId;
    const user = await User.findOne(userId, { relations: ['sleeves'] });

    if (user === undefined) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const sleeves: SleeveInfo[] = user.sleeves.map((sleeve: Sleeve) => ({
      id: sleeve.id,
      name: sleeve.name,
      fileName: sleeve.fileName
    }));

    res.send({ ok: true, sleeves });
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const sleeveId: number = parseInt(req.params.id, 10);
    const sleeve = await Sleeve.findOne(sleeveId);
    if (sleeve === undefined) {
      res.send({ error: ApiErrorEnum.SLEEVE_INVALID });
      return;
    }
    const sleeveInfo: SleeveInfo = {
      id: sleeve.id,
      name: sleeve.name,
      fileName: sleeve.fileName
    };
    res.send({ ok: true, sleeve: sleeveInfo });
  }

  @Post('/find')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32)
  })
  public async onFind(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const sleeves = await Sleeve.find({
      where: { user: { id: body.id }, name: body.name.trim() }
    });

    if (sleeves.length !== 1) {
      res.send({ error: ApiErrorEnum.SLEEVE_INVALID });
      return;
    }
    const sleeve = sleeves[0];
    const sleeveInfo: SleeveInfo = {
      id: sleeve.id,
      name: sleeve.name,
      fileName: sleeve.fileName
    };
    res.send({ ok: true, sleeve: sleeveInfo });
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

    // For predefined sleeves, we just update the user's sleeveFile
    if (body.id <= 10) { // Predefined sleeves have IDs 1-10
      try {
        user.sleeveFile = `predefined_${body.id}.png`;
        const savedUser = await user.save();
        if (savedUser) {
          this.core.emit(c => c.onUsersUpdate([savedUser]));
        }
        res.send({ ok: true });
        return;
      } catch (error) {
        res.status(400);
        res.send({ error: ApiErrorEnum.SLEEVE_INVALID });
        return;
      }
    }

    // For user sleeves, we need to check ownership
    const sleeve = await Sleeve.findOne(body.id, { relations: ['user'] });
    if (sleeve === undefined || sleeve.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.SLEEVE_INVALID });
      return;
    }

    if (user.sleeveFile === sleeve.fileName) {
      res.send({ ok: true });
      return;
    }

    try {
      user.sleeveFile = sleeve.fileName;
      const savedUser = await user.save();
      if (savedUser) {
        this.core.emit(c => c.onUsersUpdate([savedUser]));
      }
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.SLEEVE_INVALID });
      return;
    }

    res.send({ ok: true });
  }
}
