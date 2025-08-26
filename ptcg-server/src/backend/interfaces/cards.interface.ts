import { Card } from '../../game';

export interface CardsInfo {
  cards: Card[];
  hash: string;
}

export interface CardsHash {
  cardsTotal: number;
  hash: string;
}
