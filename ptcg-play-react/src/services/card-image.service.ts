import { Card } from './card.service';
import { setCodeService } from './set-code.service';

export class CardImageService {
  private static instance: CardImageService;
  private baseUrl: string;
  private imageCache: Map<string, string>;

  private constructor() {
    this.baseUrl = 'https://images.pokemontcg.io/';
    this.imageCache = new Map();
  }

  public static getInstance(): CardImageService {
    if (!CardImageService.instance) {
      CardImageService.instance = new CardImageService();
    }
    return CardImageService.instance;
  }

  public getCardImage(card: Card): string {
    if (!card.set || !card.setNumber) {
      console.warn('Invalid card data for image:', card);
      return '';
    }

    const imageKey = `${card.set} ${card.setNumber}`;
    const cachedUrl = this.imageCache.get(imageKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    const convertedSet = setCodeService.convertSetCode(card.set);
    const imageUrl = `${this.baseUrl}${convertedSet}/${card.setNumber}.png`;
    this.imageCache.set(imageKey, imageUrl);
    return imageUrl;
  }
}

export const cardImageService = CardImageService.getInstance(); 