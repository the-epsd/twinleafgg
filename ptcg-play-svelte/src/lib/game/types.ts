export const PlayerType = {
  ANY: 0,
  TOP_PLAYER: 1,
  BOTTOM_PLAYER: 2,
} as const;

export const SlotType = {
  BOARD: 0,
  ACTIVE: 1,
  BENCH: 2,
  HAND: 3,
  DISCARD: 4,
  LOSTZONE: 5,
  DECK: 6,
} as const;

export type CardTarget = {
  player: number;
  slot: number;
  index: number;
};

export type CardView = {
  id?: number;
  name: string;
  fullName: string;
  set?: string;
  setNumber?: string;
  cardImage?: string;
  imageUrl?: string;
  superType?: string | number;
  cardType?: string | number;
  trainerType?: string | number;
  energyType?: string | number;
  stage?: string | number;
  evolvesFrom?: string;
  hp?: number;
  retreat?: unknown[];
  attacks?: AttackView[];
  powers?: PowerView[];
};

export type AttackView = {
  name: string;
  cost?: unknown;
  damage?: string;
  text?: string;
};

export type PowerView = {
  name: string;
  powerType?: string | number;
  text?: string;
};

export type PokemonSlotView = {
  ownerIndex: number;
  slot: 'active' | 'bench';
  index: number;
  target: CardTarget;
  empty: boolean;
  pokemon?: CardView;
  cards: CardView[];
  damage: number;
  hp: number;
  retreat: unknown[];
  energy: CardView[];
  tools: CardView[];
  specialConditions: unknown[];
};

export type PlayerView = {
  index: number;
  id: number;
  name: string;
  hand: CardView[];
  deckCount: number;
  discard: CardView[];
  lostZone: CardView[];
  stadium: CardView[];
  playZone: CardView[];
  prizesLeft: number;
  active: PokemonSlotView;
  bench: PokemonSlotView[];
  playableCardIds: number[];
};

export type PromptView = {
  id: number;
  className: string;
  type: string;
  playerId: number;
  playerIndex: number;
  supported: boolean;
  unsupportedReason?: string;
  message?: string;
  resultSchema: string;
  fields: Record<string, unknown>;
};

export type LogView = {
  id: number;
  message: string;
  params?: unknown;
  client?: number;
};

export type GameView = {
  ready: boolean;
  phase: number;
  phaseLabel: string;
  turn: number;
  activePlayerIndex: number;
  activePlayerId?: number;
  winner?: number;
  players: PlayerView[];
  prompts: PromptView[];
  logs: LogView[];
  events: unknown[];
};

export type EngineOk = {
  ok: true;
  view: GameView;
};

export type EngineFailure = {
  ok: false;
  error: string;
  view?: GameView;
};

export type EngineResponse = EngineOk | EngineFailure;

export function targetFor(actorIndex: number, ownerIndex: number, slot: number, index = 0): CardTarget {
  return {
    player: actorIndex === ownerIndex ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER,
    slot,
    index,
  };
}
