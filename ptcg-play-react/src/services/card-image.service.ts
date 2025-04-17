import { Card } from './card.service';

export class CardImageService {
  private static instance: CardImageService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }

  public static getInstance(): CardImageService {
    if (!CardImageService.instance) {
      CardImageService.instance = new CardImageService();
    }
    return CardImageService.instance;
  }

  public getCardImage(card: any): string {
    if (!card || !card.set || !card.setNumber) {
      return '/placeholder-card.png';
    }
    return `${this.baseUrl}/v1/cards/${card.set}/${card.setNumber}/image`;
  }
}

export const cardImageService = CardImageService.getInstance(); 