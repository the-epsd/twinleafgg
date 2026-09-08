import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Sleeve, UserUnlockedItem } from '../../storage';

export class Sleeves extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const allSleeves = await Sleeve.find({ order: { sortOrder: 'ASC', name: 'ASC' } });

    const unlocked = await UserUnlockedItem.find({ where: { userId, itemType: 'sleeve' } });
    const unlockedIds = new Set(unlocked.map(item => item.itemId));

    const sleeves = allSleeves.filter(sleeve =>
      sleeve.isDefault || !sleeve.requiresUnlock || unlockedIds.has(sleeve.identifier)
    );

    res.send({
      ok: true,
      sleeves: sleeves.map(sleeve => ({
        identifier: sleeve.identifier,
        name: sleeve.name,
        imagePath: sleeve.imagePath,
        isDefault: sleeve.isDefault,
        sortOrder: sleeve.sortOrder
      }))
    });
  }
}
