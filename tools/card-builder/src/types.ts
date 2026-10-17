export type CardBase = 'PokemonCard' | 'TrainerCard' | 'EnergyCard';
export type EffectKind = 'attack' | 'power' | 'trainer' | 'energy';

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
  | 'C'
  | 'A';

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
  A: 'Any type (A)',
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

/** Multiplier (`x2`) or plus-weakness (`+10`, `+20`, `+30`, `+40`, …). */
export type WeaknessValue = 'x2' | `+${number}`;

export type PrefabScope = EffectKind | 'both';

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
  kind: EffectKind;
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

export interface PartialMatchResult {
  matched: MatchedPrefab[];
  unmatched: string[];
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
  /** Full-effect server fallback when no prefabs matched (or weak hybrid). */
  serverEffect?: ServerEffect;
  /** Per-clause server snippets used alongside prefabs. */
  serverSnippets?: ServerEffect[];
  /** Clauses that matched neither prefab nor snippet. */
  unmatchedClauses?: string[];
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
  serverEffect?: ServerEffect;
  serverSnippets?: ServerEffect[];
  unmatchedClauses?: string[];
  matchError?: string;
}

export interface ServerEffect {
  source: string;
  effectText: string;
  /** Kept for compatibility with older server-card-effects payloads. */
  attackText?: string;
  kind: EffectKind;
  body: string[];
  imports: string[];
  similarity: number;
  bodyMode?: 'branch' | 'full';
  helpers?: string[];
  /** Clause text this snippet was matched against (hybrid resolution). */
  matchedClause?: string;
  cardName?: string;
  set?: string;
  fullName?: string;
  /** Prefab / UPPER_SNAKE helpers referenced in the body. */
  prefabsUsed?: string[];
  /** Guard that produced this branch (WAS_ATTACK_USED, JUST_EVOLVED, …). */
  guard?: string;
}

export interface HybridEffectResolution {
  selectedPrefabs: SelectedPrefab[];
  serverSnippets: ServerEffect[];
  serverEffect?: ServerEffect;
  unmatchedClauses: string[];
}

export interface ReprintCandidate {
  className: string;
  name: string;
  set: string;
  setNumber: string;
  fullName: string;
  sourcePath: string;
  /** True when draft attacks/powers/text match this candidate (true reprint). */
  identical: boolean;
  /** True when this file is other-prints / full-art / alt-arts (thin wrapper). */
  isReprintFile: boolean;
}

/** Response extras from `/reprint-candidates` for distinct same-name variants. */
export interface ReprintLookupResult {
  candidates: ReprintCandidate[];
  /** Next occurrence for a distinct variant (1 = no suffix). */
  nextOccurrence: number;
  /** Suggested class name when saving as a distinct variant. */
  suggestedClassName: string;
  /** Suggested fullName when saving as a distinct variant. */
  suggestedFullName: string;
}

export interface CardDraft {
  className: string;
  extends: CardBase;
  // Pokemon
  stage: StageName;
  evolvesFrom: string;
  tags: string;
  hp: string;
  /** Energy short codes, e.g. `"R"` or `"FM"` for dual-type. Emitted as `CardType[]`. */
  cardType: string;
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
  trainerPrefabs: SelectedPrefab[];
  trainerServerEffect?: ServerEffect;
  trainerServerSnippets?: ServerEffect[];
  trainerUnmatchedClauses?: string[];
  // Energy
  energyType: 'BASIC' | 'SPECIAL';
  provides: string;
  blendedEnergies: string;
  blendedEnergyCount: string;
  energyText: string;
  energyServerEffect?: ServerEffect;
}
