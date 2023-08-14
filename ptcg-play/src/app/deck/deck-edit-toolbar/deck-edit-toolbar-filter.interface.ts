import { CardType, SuperType, Format } from 'ptcg-server';

export interface DeckEditToolbarFilter {
  format: Format[];
  superTypes: SuperType[];
  cardTypes: CardType[];
  searchValue: string;
}
