import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { DeckBox, UserUnlockedItem } from '../../storage';

export class DeckBoxes extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const allBoxes = await DeckBox.find({ order: { sortOrder: 'ASC', name: 'ASC' } });

    const unlocked = await UserUnlockedItem.find({ where: { userId, itemType: 'deck_box' } });
    const unlockedIds = new Set(unlocked.map(item => item.itemId));

    const deckBoxes = allBoxes.filter(box =>
      box.isDefault || !box.requiresUnlock || unlockedIds.has(box.identifier)
    );

    res.send({
      ok: true,
      deckBoxes: deckBoxes.map(box => ({
        identifier: box.identifier,
        name: box.name,
        imagePath: box.imagePath,
        isDefault: box.isDefault,
        sortOrder: box.sortOrder
      }))
    });
  }
}
