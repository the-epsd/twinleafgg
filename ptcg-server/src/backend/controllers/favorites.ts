import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { UserFavoriteCard } from '../../storage';
import { CardManager } from '../../game';

export class Favorites extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const favorites = await UserFavoriteCard.find({ where: { userId } });

    const favoritesMap: { [cardName: string]: string } = {};
    favorites.forEach(fav => {
      favoritesMap[fav.cardName] = fav.fullName;
    });

    res.send({ ok: true, favorites: favoritesMap });
  }

  @Post('/set')
  @AuthToken()
  @Validate({
    cardName: check().required(),
    fullName: check().required()
  })
  public async onSet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { cardName: string, fullName: string } = req.body;

    // Validate that the card exists
    const cardManager = CardManager.getInstance();
    const card = cardManager.getCardByName(body.fullName);
    if (!card || card.name !== body.cardName) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM });
      return;
    }

    // Find existing favorite or create new
    let favorite = await UserFavoriteCard.findOne({
      where: { userId, cardName: body.cardName }
    });

    if (favorite) {
      favorite.fullName = body.fullName;
    } else {
      favorite = new UserFavoriteCard();
      favorite.userId = userId;
      favorite.cardName = body.cardName;
      favorite.fullName = body.fullName;
    }

    try {
      await favorite.save();
      res.send({ ok: true });
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/clear')
  @AuthToken()
  @Validate({
    cardName: check().required()
  })
  public async onClear(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { cardName: string } = req.body;

    const favorite = await UserFavoriteCard.findOne({
      where: { userId, cardName: body.cardName }
    });

    if (favorite) {
      try {
        await favorite.remove();
        res.send({ ok: true });
      } catch (error) {
        res.status(400);
        res.send({ error: ApiErrorEnum.SERVER_ERROR });
      }
    } else {
      res.send({ ok: true });
    }
  }

}
