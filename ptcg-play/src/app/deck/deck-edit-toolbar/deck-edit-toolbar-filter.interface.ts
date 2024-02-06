import { CardType, SuperType, Format, CardTag } from 'ptcg-server';

export interface DeckEditToolbarFilter {
  formats: Format[];
  superTypes: SuperType[];
  cardTypes: CardType[];
  tags: CardTag[];
  searchValue?: string;
}
