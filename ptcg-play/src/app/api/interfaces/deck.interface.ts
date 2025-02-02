import { CardTag, CardType, Format } from 'ptcg-server';
import { Response } from './response.interface';
import { DeckItem } from 'src/app/deck/deck-card/deck-card.interface';

export interface DeckListEntry {
  id: number;
  name: string;
  cardType: CardType[];
  cardTag: CardTag[];
  cards: string[];
  format: Format[];
  isValid: boolean;
  deckItems: DeckItem[];
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
