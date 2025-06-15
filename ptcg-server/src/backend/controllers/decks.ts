import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { CardManager, DeckAnalyser } from '../../game';
import { Controller, Get, Post } from './controller';
import { DeckSaveRequest } from '../interfaces';
import { ApiErrorEnum } from '../common/errors';
import { User, Deck } from '../../storage';
import { THEME_DECKS } from '../../game/store/prefabs/theme-decks';

export class Decks extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId, { relations: ['decks'] });

    if (user === undefined) {
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const decks = user.decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      isValid: deck.isValid,
      cards: JSON.parse(deck.cards),
      cardTypes: JSON.parse(deck.cardTypes),
      manualArchetype1: deck.manualArchetype1,
      manualArchetype2: deck.manualArchetype2
    }));

    // Inject theme decks (with negative IDs)
    const themeDecks = THEME_DECKS.map(deck => ({
      ...deck,
      // Ensure the structure matches user decks
      cardTypes: [],
      deckItems: [],
    }));

    res.send({ ok: true, decks: [...decks, ...themeDecks] });
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const deckId: number = parseInt(req.params.id, 10);
    // Check if this is a theme deck
    const themeDeck = THEME_DECKS.find(d => d.id === deckId);
    if (themeDeck) {
      res.send({ ok: true, deck: themeDeck });
      return;
    }
    const entity = await Deck.findOne(deckId, { relations: ['user'] });

    if (entity === undefined || entity.user.id !== userId) {
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const deck = {
      id: entity.id,
      name: entity.name,
      isValid: entity.isValid,
      cardTypes: JSON.parse(entity.cardTypes),
      cards: JSON.parse(entity.cards),
      manualArchetype1: entity.manualArchetype1,
      manualArchetype2: entity.manualArchetype2
    };

    res.send({ ok: true, deck });
  }

  @Post('/save')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    cards: check().required()
  })
  public async onSave(req: Request, res: Response) {
    const body: DeckSaveRequest = req.body;

    // optional id parameter, without ID new deck will be created
    if (body.id !== undefined && typeof body.id !== 'number') {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'id' });
      return;
    }

    // check if all cards exist in our database
    if (!this.validateCards(body.cards)) {
      res.status(400);
      res.send({ error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'cards' });
      return;
    }

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    let deck = body.id !== undefined
      ? await Deck.findOne(body.id, { relations: ['user'] })
      : (() => { const d = new Deck(); d.user = user; return d; })();

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const deckUtils = new DeckAnalyser(body.cards);
    deck.name = body.name.trim();
    deck.cards = JSON.stringify(body.cards);
    deck.isValid = deckUtils.isValid();
    deck.cardTypes = JSON.stringify(deckUtils.getDeckType());
    deck.manualArchetype1 = body.manualArchetype1 || '';
    deck.manualArchetype2 = body.manualArchetype2 || '';

    try {
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.NAME_DUPLICATE });
      return;
    }

    res.send({
      ok: true, deck: {
        id: deck.id,
        name: deck.name,
        cards: body.cards,
        manualArchetype1: deck.manualArchetype1,
        manualArchetype2: deck.manualArchetype2
      }
    });
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDelete(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const deck = await Deck.findOne(body.id, { relations: ['user'] });

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    await deck.remove();

    res.send({ ok: true });
  }

  @Post('/rename')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onRename(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    let deck = await Deck.findOne(body.id, { relations: ['user'] });

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    try {
      deck.name = body.name.trim();
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({ error: ApiErrorEnum.NAME_DUPLICATE });
      return;
    }

    res.send({
      ok: true, deck: {
        id: deck.id,
        name: deck.name
      }
    });
  }

  @Post('/duplicate')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onDuplicate(req: Request, res: Response) {
    const body: any = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const deck = await Deck.findOne(body.id, { relations: ['user'] });

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    delete body.id;
    body.cards = JSON.parse(deck.cards);
    return this.onSave(req, res);
  }

  private validateCards(deck: string[]) {
    if (!(deck instanceof Array)) {
      return false;
    }

    const cardManager = CardManager.getInstance();
    for (let i = 0; i < deck.length; i++) {
      if (typeof deck[i] !== 'string' || !cardManager.isCardDefined(deck[i])) {
        return false;
      }
    }

    return true;
  }

}
