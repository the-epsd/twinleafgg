import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Controller, Get } from './controller';
import { CardsInfo } from '../interfaces/cards.interface';
import { CardManager } from '../../game';
import { Md5 } from '../../utils/md5';

export class Cards extends Controller {

  private cardsInfo?: CardsInfo;
  private cardImageMap?: Record<string, string>;

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

  @Get('/image-map')
  public async onImageMap(req: Request, res: Response) {
    if (!this.cardImageMap) {
      this.cardImageMap = this.buildCardImageMap();
    }

    res.send({ ok: true, images: this.cardImageMap });
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

  private buildCardImageMap(): Record<string, string> {
    const setsDir = path.join(process.cwd(), 'src', 'sets');
    const images: Record<string, string> = {};
    if (!fs.existsSync(setsDir)) {
      return images;
    }

    for (const filePath of this.findCardDataFiles(setsDir)) {
      const cards = JSON.parse(fs.readFileSync(filePath, 'utf8')) as any[];
      for (const card of cards) {
        const setCode = card?.set?.ptcgoCode;
        const setNumber = card?.number;
        const imageUrl = card?.images?.large || card?.images?.small;
        if (!setCode || !setNumber || !imageUrl) {
          continue;
        }
        images[`${setCode} ${setNumber}`] = imageUrl;
        images[`${setCode} ${String(setNumber).padStart(3, '0')}`] = imageUrl;
        if (card.supertype === 'Energy' && typeof card.name === 'string' && !images[card.name]) {
          images[card.name] = imageUrl;
        }
      }
    }
    return images;
  }

  private findCardDataFiles(dir: string): string[] {
    const result: string[] = [];
    for (const entry of fs.readdirSync(dir)) {
      const entryPath = path.join(dir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        result.push(...this.findCardDataFiles(entryPath));
      } else if (entry === 'card-data.json') {
        result.push(entryPath);
      }
    }
    return result;
  }
}
