import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Coin, UserUnlockedItem } from '../../storage';

export class Coins extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const allCoins = await Coin.find({ order: { sortOrder: 'ASC', name: 'ASC' } });

    const unlocked = await UserUnlockedItem.find({ where: { userId, itemType: 'coin' } });
    const unlockedIds = new Set(unlocked.map(item => item.itemId));

    const coins = allCoins.filter(coin =>
      coin.isDefault || !coin.requiresUnlock || unlockedIds.has(coin.identifier)
    );

    res.send({
      ok: true,
      coins: coins.map(coin => ({
        identifier: coin.identifier,
        name: coin.name,
        imagePath: coin.imagePath,
        isDefault: coin.isDefault,
        sortOrder: coin.sortOrder
      }))
    });
  }
}
