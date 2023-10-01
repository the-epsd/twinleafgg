import { Response } from './response.interface';
import { CardTag, CardType, Format } from 'ptcg-server';

export interface DeckListEntry {
  id: number;
  name: string;
  cardType: CardType[];
  cardTag: CardTag[];
  format: Format[];
  isValid: boolean;
}

export interface DeckListResponse extends Response {
  decks: DeckListEntry[];
}

export interface Deck {
  id: number;
  name: string;
  cardType: CardType[];
  cardTag: CardTag[];
  format: Format[];
  isValid: boolean;
  cards: string[];
}

export interface DeckResponse extends Response {
  deck: Deck;
}
