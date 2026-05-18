import type { CardView, PokemonSlotView } from './types';

const BASIC_STAGE = 2;

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
  if (isEnergyCard(card)) {
    return !slot.empty;
  }
  if (isPokemonCard(card)) {
    if (slot.slot !== 'bench' && slot.slot !== 'active') {
      return false;
    }
    return slot.empty ? isBasicPokemonCard(card) : canEvolveSlot(card, slot);
  }
  return false;
}

export function canPlayCardToPlayArea(card: CardView | undefined, actorIndex: number | undefined): boolean {
  return actorIndex !== undefined && isTrainerOrGenericPlayCard(card);
}

export function canRetreatToSlot(active: PokemonSlotView | undefined, bench: PokemonSlotView): boolean {
  if (!active || active.empty || bench.empty || bench.ownerIndex !== active.ownerIndex) {
    return false;
  }
  return active.energy.length >= active.retreat.length;
}
