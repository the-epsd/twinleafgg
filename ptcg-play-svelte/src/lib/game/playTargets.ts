import type { CardView, PlayerView, PokemonSlotView } from './types';

const BASIC_STAGE = 2;

export type BoardPlayAreaContext = {
  selected: CardView | undefined;
  selectedPlayerIndex: number | undefined;
  dragging: CardView | undefined;
  draggingPlayerIndex: number | undefined;
  activePlayerIndex: number | undefined;
  hasPrompt: boolean;
  finished: boolean;
  inSetup: boolean;
};

export type PlayerActionContext = {
  playerIndex: number;
  activePlayerIndex: number | undefined;
  hasPrompt: boolean;
  finished: boolean;
};

export function isEnergyCard(card: CardView | undefined): boolean {
  return !!card && (card.energyType !== undefined || /\bEnergy\b/i.test(card.name));
}

export function isPokemonCard(card: CardView | undefined): card is CardView {
  return !!card && !isEnergyCard(card) && card.trainerType === undefined;
}

export function isTrainerOrGenericPlayCard(card: CardView | undefined): boolean {
  return !!card && !isEnergyCard(card) && !isPokemonCard(card);
}

export function isBasicPokemonCard(card: CardView | undefined): card is CardView {
  if (!isPokemonCard(card)) {
    return false;
  }
  return card.stage === BASIC_STAGE || (card.stage === undefined && !card.evolvesFrom);
}

export function canEvolveSlot(card: CardView | undefined, slot: PokemonSlotView): boolean {
  return isPokemonCard(card) && !slot.empty && !!card?.evolvesFrom && slot.pokemon?.name === card.evolvesFrom;
}

export function canPlayCardToSlot(
  card: CardView | undefined,
  actorIndex: number | undefined,
  slot: PokemonSlotView,
): boolean {
  if (!card || actorIndex === undefined) {
    return false;
  }
  if (slot.ownerIndex !== actorIndex) {
    return false;
  }
  return slot.slot === 'bench' || slot.slot === 'active';
}

export function canPlayCardToPlayArea(card: CardView | undefined, actorIndex: number | undefined): boolean {
  return actorIndex !== undefined && !!card;
}

export function canPlayerAct(context: PlayerActionContext): boolean {
  return context.activePlayerIndex === context.playerIndex && !context.hasPrompt && !context.finished;
}

export function canPlayCardToBoardArea(context: BoardPlayAreaContext): boolean {
  if (context.inSetup || context.hasPrompt || context.finished || context.activePlayerIndex === undefined) {
    return false;
  }
  const selectedCanPlay =
    context.selectedPlayerIndex === context.activePlayerIndex &&
    canPlayCardToPlayArea(context.selected, context.selectedPlayerIndex);
  const draggingCanPlay =
    context.draggingPlayerIndex === context.activePlayerIndex &&
    canPlayCardToPlayArea(context.dragging, context.draggingPlayerIndex);
  return selectedCanPlay || draggingCanPlay;
}

export function playableBenchSlot(
  player: PlayerView,
  card: CardView | undefined,
  actorIndex: number | undefined,
  inSetup: boolean,
): PokemonSlotView | undefined {
  if (inSetup) {
    return undefined;
  }
  const slots = player.bench.filter((slot) => canPlayCardToSlot(card, actorIndex, slot));
  return slots.find((slot) => slot.empty) ?? slots[0];
}

export function canRetreatToSlot(active: PokemonSlotView | undefined, bench: PokemonSlotView): boolean {
  if (!active || active.empty || bench.empty || bench.ownerIndex !== active.ownerIndex) {
    return false;
  }
  return true;
}
