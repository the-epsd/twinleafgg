export type CardBase = 'PokemonCard' | 'TrainerCard' | 'EnergyCard';

export type EnergyShort =
  | 'G'
  | 'R'
  | 'W'
  | 'L'
  | 'P'
  | 'F'
  | 'D'
  | 'M'
  | 'Y'
  | 'N'
  | 'C';

export const ENERGY_SHORTS: EnergyShort[] = [
  'G',
  'R',
  'W',
  'L',
  'P',
  'F',
  'D',
  'M',
  'Y',
  'N',
  'C',
];

export const ENERGY_LABELS: Record<EnergyShort, string> = {
  G: 'Grass (G)',
  R: 'Fire (R)',
  W: 'Water (W)',
  L: 'Lightning (L)',
  P: 'Psychic (P)',
  F: 'Fighting (F)',
  D: 'Dark (D)',
  M: 'Metal (M)',
  Y: 'Fairy (Y)',
  N: 'Dragon (N)',
  C: 'Colorless (C)',
};

export const STAGES = [
  'BASIC',
  'STAGE_1',
  'STAGE_2',
  'VMAX',
  'VSTAR',
  'VUNION',
  'LEGEND',
  'MEGA',
  'BREAK',
  'LV_X',
  'RESTORED',
  'NONE',
] as const;

export type StageName = (typeof STAGES)[number];

export const POWER_TYPES = [
  'ABILITY',
  'POKEPOWER',
  'POKEBODY',
  'POKEMON_POWER',
  'ANCIENT_TRAIT',
  'BABY_RULE',
  'HELD_ITEM',
  'VUNION_ASSEMBLY',
  'LEGEND_ASSEMBLY',
  'TRAINER_ABILITY',
  'HOLONS_SPECIAL_ENERGY_EFFECT',
  'ENERGY_ABILITY',
  'MEGA_EVOLUTION_RULE',
  'LV_X_RULE',
  'BREAK_RULE',
  'ARCEUS_RULE',
] as const;

export type PowerTypeName = (typeof POWER_TYPES)[number];

export type WeaknessValue = 'x2' | '+20' | '+30';

export type PrefabScope = 'attack' | 'power' | 'both';

export interface PrefabParamDef {
  key: string;
  label: string;
  type: 'number' | 'string' | 'energy' | 'boolean';
  defaultValue?: string | number | boolean;
}

export interface PrefabDefinition {
  id: string;
  name: string;
  description: string;
  exampleTexts: string[];
  scope: PrefabScope;
  importFrom: string;
  importNames: string[];
  /** Extra imports needed beyond the prefab itself (e.g. MarkerConstants). */
  extraImports?: string[];
  params: PrefabParamDef[];
  /** Patterns tried against normalized effect text. Capture groups map to param keys via paramCaptures. */
  patterns: RegExp[];
  /** Maps capture group index (1-based) to param key. */
  paramCaptures?: Record<number, string>;
  /**
   * Generate the body lines inside the WAS_ATTACK_USED / WAS_POWER_USED block.
   * Return true if the last statement should be returned.
   */
  generateCall: (params: Record<string, string>, ctx: PrefabGenContext) => PrefabCallResult;
  /** Optional companion lines outside the attack/power block (markers, cleanup). */
  generateCompanions?: (params: Record<string, string>, ctx: PrefabGenContext) => string[];
}

export interface PrefabGenContext {
  kind: 'attack' | 'power';
  index: number;
  attackName?: string;
  powerName?: string;
}

export interface PrefabCallResult {
  lines: string[];
  returns?: boolean;
}

export interface MatchedPrefab {
  prefab: PrefabDefinition;
  params: Record<string, string>;
  matchedText: string;
}

export interface SelectedPrefab {
  id: string;
  prefabId: string;
  params: Record<string, string>;
  /** How it was added: auto-matched from text, or manually picked. */
  source: 'matched' | 'manual';
}

export interface AttackDraft {
  id: string;
  enabled: boolean;
  name: string;
  cost: string;
  damage: string;
  damageCalculation: '' | '+' | 'x' | '-';
  text: string;
  selectedPrefabs: SelectedPrefab[];
  serverEffect?: ServerEffect;
  matchError?: string;
}

export interface PowerDraft {
  id: string;
  name: string;
  powerType: PowerTypeName;
  text: string;
  useWhenInPlay: boolean;
  useFromHand: boolean;
  useFromHandToBench: boolean;
  useFromDiscard: boolean;
  exemptFromAbilityLock: boolean;
  exemptFromInitialize: boolean;
  abilityLock: boolean;
  barrage: boolean;
  knocksOutSelf: boolean;
  isFossil: boolean;
  selectedPrefabs: SelectedPrefab[];
  matchError?: string;
}

export interface ServerEffect {
  source: string;
  attackText: string;
  body: string[];
  imports: string[];
  similarity: number;
}

export interface CardDraft {
  className: string;
  extends: CardBase;
  // Pokemon
  stage: StageName;
  evolvesFrom: string;
  tags: string;
  hp: string;
  cardType: EnergyShort;
  weaknessType: '' | EnergyShort;
  weaknessValue: WeaknessValue;
  resistanceType: '' | EnergyShort;
  resistanceValue: string;
  retreat: string;
  hasPowers: boolean;
  hasAttacks: boolean;
  powers: PowerDraft[];
  attacks: AttackDraft[];
  // Shared meta
  regulationMark: string;
  set: string;
  setNumber: string;
  name: string;
  // Trainer
  trainerType: 'ITEM' | 'SUPPORTER' | 'STADIUM' | 'TOOL';
  trainerText: string;
  // Energy
  energyType: 'BASIC' | 'SPECIAL';
  provides: string;
  energyText: string;
}
