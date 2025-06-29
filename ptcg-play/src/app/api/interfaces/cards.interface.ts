import { Response } from './response.interface';
import { Card, CardsInfo } from 'ptcg-server';

export interface CardsResponse extends Response {
  cards: Card[];
  cardsInfo: CardsInfo;
}

export interface CardsHashResponse extends Response {
  cardsTotal: number;
  hash: string;
}

export interface CardArtwork {
  id: number;
  name: string;
  cardName: string;
  setCode: string;
  code: string;
  imageUrl: string;
  holoType: string;
}