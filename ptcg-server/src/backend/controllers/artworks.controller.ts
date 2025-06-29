import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage, UserUnlockedItem, CardArtwork } from '../../storage';
import { In } from 'typeorm';

export class Artworks extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  @Get('/unlocked')
  @AuthToken()
  public async onGetUnlockedArtworks(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;

      const unlockedItems = await UserUnlockedItem.find({
        where: { userId, itemType: 'card_artwork' }
      });

      const artworkIds = unlockedItems.map(i => Number(i.itemId));

      if (artworkIds.length === 0) {
        return res.send({ ok: true, artworks: [] });
      }

      const artworks = await CardArtwork.find({
        where: { id: In(artworkIds) }
      });

      res.send({ ok: true, artworks });
    } catch (error) {
      console.error('Error fetching unlocked artworks:', error);
      res.status(500).send({ error: 'Server error' });
    }
  }
} 