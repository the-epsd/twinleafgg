import { CardType, SuperType, Format, CardTag, Stage } from 'ptcg-server';

export interface DeckEditToolbarFilter {
  formats: Format[];
  superTypes: SuperType[];
  cardTypes: CardType[];
  stages: Stage[];
  tags: CardTag[];
  searchValue?: string;
}
