import type {
  CardTag,
  CardType,
  Format,
  Stage,
  SuperType,
  EnergyType,
  TrainerType,
} from 'ptcg-server';
import type { Card } from 'ptcg-server';

export interface DeckSlot {
  card: Card;
  count: number;
}

/** Mirrors Angular `DeckEditToolbarFilter` (subset used in React). */
export interface DeckEditToolbarFilter {
  selectedSet: string | null;
  showLibraryCardTypeBadge: boolean;
  formats: Format[];
  superTypes: SuperType[];
  cardTypes: CardType[];
  energyTypes: EnergyType[];
  trainerTypes: TrainerType[];
  stages: Stage[];
  attackCosts: number[];
  retreatCosts: number[];
  tags: CardTag[];
  searchValue: string;
  hasAbility: boolean;
}

export function defaultToolbarFilter(): DeckEditToolbarFilter {
  return {
    selectedSet: null,
    showLibraryCardTypeBadge: false,
    formats: [],
    superTypes: [],
    cardTypes: [],
    energyTypes: [],
    trainerTypes: [],
    stages: [],
    attackCosts: [],
    retreatCosts: [],
    tags: [],
    searchValue: '',
    hasAbility: false,
  };
}
