import { CardType, SuperType, Format, CardTag, Stage, EnergyType, TrainerType } from 'ptcg-server';

export interface DeckEditToolbarFilter {
  formats: Format[];
  superTypes: SuperType[];
  cardTypes: CardType[];
  energyTypes: EnergyType[];
  trainerTypes: TrainerType[];
  stages: Stage[];
  attackCosts: number[];
  retreatCosts: number[];
  tags: CardTag[];
  searchValue?: string;
  hasAbility: boolean;
}
