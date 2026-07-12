import { Request, Response } from 'express';
import { Controller, Get } from './controller';
import { CardParentMap, CardParentMapEntry, CardsInfo } from '../interfaces/cards.interface';
import { Card, CardManager } from '../../game';
import { Md5 } from '../../utils/md5';

const BASE_CARD_CLASS_NAMES = new Set([
  'TrainerCard',
  'PokemonCard',
  'EnergyCard',
  'Card',
  'Object',
  'Function',
]);

export class Cards extends Controller {

  private cardsInfo?: CardsInfo;
  private parentMap?: CardParentMap;

  @Get('/all')
  public async onAll(req: Request, res: Response) {
    if (!this.cardsInfo) {
      this.cardsInfo = this.buildCardsInfo();
    }

    res.send({ ok: true, cardsInfo: this.cardsInfo });
  }

  @Get('/hash')
  public async onHash(req: Request, res: Response) {
    if (!this.cardsInfo) {
      this.cardsInfo = this.buildCardsInfo();
    }
    const cardsTotal = this.cardsInfo.cards.length;
    const hash = this.cardsInfo.hash;
    res.send({ ok: true, cardsTotal, hash });
  }

  @Get('/parent-map')
  public async onParentMap(_req: Request, res: Response) {
    if (!this.parentMap) {
      this.parentMap = this.buildParentMap();
    }
    res.send({ ok: true, parentMap: this.parentMap });
  }

  private buildCardsInfo(): CardsInfo {
    const cardManager = CardManager.getInstance();
    const allCards = cardManager.getAllCards();

    const cardsInfo: CardsInfo = {
      cards: allCards,
      hash: ''
    };

    const hash = Md5.init(JSON.stringify(cardsInfo));
    cardsInfo.hash = hash;
    return cardsInfo;
  }

  private buildParentMap(): CardParentMap {
    const allCards = CardManager.getInstance().getAllCards();
    const byClassName = new Map<string, Card>();

    for (const card of allCards) {
      const className = card.constructor.name;
      if (!byClassName.has(className)) {
        byClassName.set(className, card);
      }
    }

    const entries: CardParentMapEntry[] = allCards.map((card) => {
      const parentCtor = Object.getPrototypeOf(card.constructor) as Function | null;
      const parentClassName =
        parentCtor && typeof parentCtor.name === 'string' && parentCtor.name.length > 0
          ? parentCtor.name
          : null;

      let parentFullName: string | null = null;
      if (parentClassName && !BASE_CARD_CLASS_NAMES.has(parentClassName)) {
        const parentCard = byClassName.get(parentClassName);
        parentFullName = parentCard?.fullName ?? null;
      }

      const regulationMark = (card as Card & { regulationMark?: string }).regulationMark;

      return {
        fullName: card.fullName,
        name: card.name,
        set: card.set,
        setNumber: card.setNumber,
        className: card.constructor.name,
        parentClassName,
        parentFullName,
        regulationMark,
        superType: card.superType,
      };
    });

    return { entries };
  }
}
