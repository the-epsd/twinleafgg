import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get, Post } from './controller';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage, UserUnlockedItem, CardArtwork } from '../../storage';
import { Validate, check } from '../services';
import { In } from 'typeorm';

export class Artworks extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  // Admin helper: upsert a card artwork row
  @Post('/admin/upsert')
  @AuthToken()
  @Validate({
    id: check().isNumber().required(),
    name: check().required(),
    cardName: check().required(),
    setCode: check().required(),
    code: check().required(),
    imageUrl: check().required(),
    holoType: check()
  })
  public async onUpsertArtwork(req: Request, res: Response) {
    try {
      const userRole = (req.body as any).roleId || 0;
      if (userRole < 4) { // require admin+ (roleId 4/5)
        return res.status(403).send({ error: 'Forbidden' });
      }
      const { id, name, cardName, setCode, code, imageUrl, holoType } = req.body;
      let row = await CardArtwork.findOne({ where: { id } });
      if (!row) { row = new CardArtwork(); row.id = id; }
      row.name = name;
      row.cardName = cardName;
      row.setCode = setCode;
      row.code = code;
      row.imageUrl = imageUrl;
      row.holoType = holoType || 'default';
      await row.save();
      res.send({ ok: true, artwork: row });
    } catch (err) {
      console.error('Upsert artwork failed', err);
      res.status(500).send({ error: 'Server error' });
    }
  }

  // Admin helper: grant unlock to a user
  @Post('/admin/grant')
  @AuthToken()
  @Validate({
    artworkId: check().isNumber().required()
  })
  public async onGrantArtwork(req: Request, res: Response) {
    try {
      const userRole = (req.body as any).roleId || 0;
      if (userRole < 4) { // require admin+ (roleId 4/5)
        return res.status(403).send({ error: 'Forbidden' });
      }
      const userId: number = (req.body as any).userId; // from AuthToken middleware
      const { artworkId } = req.body;
      const exists = await UserUnlockedItem.findOne({ where: { userId, itemType: 'card_artwork', itemId: String(artworkId) } });
      if (!exists) {
        const unlockedItem = new UserUnlockedItem();
        unlockedItem.userId = userId;
        unlockedItem.itemId = String(artworkId);
        unlockedItem.itemType = 'card_artwork';
        await unlockedItem.save();
      }
      res.send({ ok: true });
    } catch (err) {
      console.error('Grant artwork failed', err);
      res.status(500).send({ error: 'Server error' });
    }
  }

  @Get('/unlocked')
  @AuthToken()
  public async onGetUnlockedArtworks(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;

      const unlockedItems = await UserUnlockedItem.find({
        where: { userId, itemType: 'card_artwork' }
      });

      const artworkIds = unlockedItems.map(i => Number(i.itemId)).filter(id => !Number.isNaN(id));

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