import { Archetype, CardType, TrainerType } from 'ptcg-server';

export const MOCK_SHOWCASE_FORMATS = [
  {
    label: 'Standard',
    deckName: 'Lugia VSTAR',
    queueCount: 12,
    archetype: Archetype.LUGIA,
  },
  {
    label: 'Standard Nightly',
    deckName: 'Mew VMAX',
    queueCount: 8,
    archetype: Archetype.MEW,
  },
  {
    label: 'Expanded',
    deckName: 'Pikachu & Zekrom',
    queueCount: 5,
    archetype: Archetype.PIKACHU,
  },
  {
    label: 'GLC',
    deckName: 'Lost Box',
    queueCount: 0,
    archetype: Archetype.UNOWN,
  },
] as const;

export const MOCK_SHOWCASE_DECKS = [
  {
    id: '1',
    name: 'Lugia VSTAR Control',
    isValid: true,
    archetype: Archetype.LUGIA,
    isDefault: true,
  },
  {
    id: '2',
    name: 'Mew VMAX Fusion Strike',
    isValid: true,
    archetype: Archetype.MEW,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Pikachu & Zekrom Tag Team',
    isValid: false,
    archetype: Archetype.PIKACHU,
    isDefault: false,
  },
  {
    id: '4',
    name: 'Lost Box Toolbox',
    isValid: true,
    archetype: Archetype.UNOWN,
    isDefault: false,
  },
] as const;

export const MOCK_SHOWCASE_FRIENDS = [
  {
    name: 'Ash Ketchum',
    initials: 'AK',
    ranking: 1250,
    connected: true,
    status: 'accepted' as const,
  },
  {
    name: 'Misty',
    initials: 'MI',
    ranking: 1180,
    connected: false,
    status: 'accepted' as const,
  },
  {
    name: 'Brock',
    initials: 'BR',
    ranking: 1320,
    connected: true,
    status: 'blocked' as const,
  },
] as const;

export const MOCK_SHOWCASE_ARCHETYPES = [
  Archetype.LUGIA,
  Archetype.MEW,
  Archetype.PIKACHU,
  Archetype.CHARIZARD,
  Archetype.GARDEVOIR,
  Archetype.UNOWN,
] as const;

export const MOCK_SHOWCASE_ENERGY_TYPES = [
  CardType.GRASS,
  CardType.FIRE,
  CardType.WATER,
  CardType.LIGHTNING,
  CardType.PSYCHIC,
  CardType.FIGHTING,
  CardType.DARK,
  CardType.METAL,
  CardType.FAIRY,
  CardType.DRAGON,
] as const;

export const MOCK_SHOWCASE_FORMAT_TABS = [
  'All',
  'Standard',
  'Standard Nightly',
  'GLC',
  'Expanded',
] as const;

export const MOCK_SHOWCASE_TRAINER_TYPES = [
  TrainerType.ITEM,
  TrainerType.SUPPORTER,
  TrainerType.STADIUM,
  TrainerType.TOOL,
] as const;
