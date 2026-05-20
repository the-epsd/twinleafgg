import { sameTarget, targetForPromptSlot } from './targets';
import type { CardTarget, CardView, PlayerView, PokemonSlotView, PromptView } from './types';

export type AttachAssignment = {
  energyIndex: number;
  target: CardTarget;
};

type IndexedCardView = CardView & {
  index?: number;
};

type PendingEnergyCard = CardView & {
  pendingAttach: true;
};

export function previewSlot(slot: PokemonSlotView, card: CardView | undefined): PokemonSlotView {
  if (!card) {
    return slot;
  }
  return {
    ...slot,
    empty: false,
    pokemon: card,
    cards: [card],
    damage: 0,
    hp: 0,
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

export function previewAttachEnergySlot(
  slot: PokemonSlotView,
  prompt: PromptView | null | undefined,
  assignments: AttachAssignment[],
  cards: IndexedCardView[],
): PokemonSlotView {
  if (!prompt) {
    return slot;
  }
  const target = targetForPromptSlot(prompt, slot);
  const pending = assignments
    .filter((assignment) => sameTarget(assignment.target, target))
    .map((assignment) => {
      const card = cards.find((item, index) => (item.index ?? index) === assignment.energyIndex);
      return card ? ({ ...card, pendingAttach: true } satisfies PendingEnergyCard) : undefined;
    })
    .filter((card): card is PendingEnergyCard => !!card);
  return pending.length
    ? {
        ...slot,
        energy: [...slot.energy, ...pending],
      }
    : slot;
}

export function benchSlotsFor(
  player: PlayerView,
  prompt: PromptView | null | undefined,
  benchIndexes: number[],
): PokemonSlotView[] {
  const occupied = player.bench.filter((slot) => !slot.empty);
  if (!prompt || player.index !== prompt.playerIndex) {
    return occupied;
  }
  const emptySlots = player.bench.filter((slot) => slot.empty);
  const previews = benchIndexes
    .map((handIndex, index) => {
      const card = player.hand[handIndex];
      const slot = emptySlots[index] ?? player.bench[index] ?? player.bench[0];
      return slot && card ? previewSlot(slot, card) : undefined;
    })
    .filter((slot): slot is PokemonSlotView => !!slot);
  return [...occupied, ...previews];
}
