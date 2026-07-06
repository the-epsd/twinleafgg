import type { Card, CardTarget, ChooseCardsPrompt } from 'ptcg-server';
import { GameMessage, PlayerType, SlotType } from 'ptcg-server';

/**
 * True when every card in the prompt list is from the player's hand (may be a filtered
 * subset, e.g. Ultra Ball's handTemp that excludes the card being played).
 */
export function isChooseCardsFromPlayerHand(prompt: ChooseCardsPrompt): boolean {
  if (prompt.cards.cards.length === 0) {
    return false;
  }
  const handCards = prompt.player.hand.cards;
  const handSet = new Set(handCards);
  return prompt.cards.cards.every(c => handSet.has(c));
}

/** Use 3D hand clicks instead of the Choose cards popup when selecting from your own hand. */
export function shouldUseBoardHandForChooseCards(
  prompt: ChooseCardsPrompt,
  clientId: number,
): boolean {
  if (prompt.options.isSecret) {
    return false;
  }
  return prompt.player.id === clientId && isChooseCardsFromPlayerHand(prompt);
}

/** Setup: choose Active + up to 5 Bench from hand on the 3D board. */
export function isChooseStartingPokemonsHandPrompt(prompt: ChooseCardsPrompt): boolean {
  return prompt.message === GameMessage.CHOOSE_STARTING_POKEMONS;
}

/** Ordered hand indices chosen during a setup starting-Pokémon prompt. */
export function getChooseHandCardSelectionHandIndices(targets: CardTarget[]): number[] {
  return targets.filter(t => t.slot === SlotType.HAND).map(t => t.index);
}

/** Where the Nth picked Basic should appear (Active first, then empty Bench slots). */
export function getSetupPlaySlotForPickOrder(
  prompt: ChooseCardsPrompt,
  pickOrder: number,
): { player: PlayerType; slot: SlotType; index: number } | null {
  const player = prompt.player;
  const activeOccupied = player.active.cards.length > 0;

  if (!activeOccupied && pickOrder === 0) {
    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
  }

  const benchPickIndex = activeOccupied ? pickOrder : pickOrder - 1;
  if (benchPickIndex < 0) {
    return null;
  }

  let emptyBenchSeen = 0;
  for (let i = 0; i < player.bench.length; i++) {
    if (player.bench[i].cards.length === 0) {
      if (emptyBenchSeen === benchPickIndex) {
        return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: i };
      }
      emptyBenchSeen++;
    }
  }

  return null;
}

export function setupPreviewMeshId(playerId: number, slot: SlotType, index: number): string {
  if (slot === SlotType.ACTIVE) {
    return `setup_preview_${playerId}_active`;
  }
  return `setup_preview_${playerId}_bench_${index}`;
}

/** True when setup skips the Active step (e.g. extra Bench after mulligan). */
export function isSetupActivePhaseSkipped(prompt: ChooseCardsPrompt): boolean {
  return prompt.player.active.cards.length > 0;
}

/** Eligible unselected Basics still in hand for setup. */
export function countEligibleUnselectedSetupHandBasics(
  prompt: ChooseCardsPrompt,
  selectedHandIndices: readonly number[],
): number {
  const selected = new Set(selectedHandIndices);
  const cards = prompt.cards.cards;
  const blocked = prompt.options.blocked ?? [];
  const handCards = prompt.player.hand.cards;
  let count = 0;
  for (let handIndex = 0; handIndex < handCards.length; handIndex++) {
    if (selected.has(handIndex)) {
      continue;
    }
    const promptIndex = chooseCardsHandIndexToPromptIndex(prompt, handIndex);
    if (promptIndex === -1) {
      continue;
    }
    if (isChooseCardsHandIndexEligible(cards, prompt.filter, blocked, promptIndex)) {
      count++;
    }
  }
  return count;
}

/** Map a hand slot index to an index in prompt.cards.cards, or -1 if not in the prompt list. */
export function chooseCardsHandIndexToPromptIndex(
  prompt: ChooseCardsPrompt,
  handIndex: number,
): number {
  const handCard = prompt.player.hand.cards[handIndex];
  if (!handCard) {
    return -1;
  }
  return prompt.cards.cards.indexOf(handCard);
}

export function chooseCardsHandTargetsToPromptIndices(
  prompt: ChooseCardsPrompt,
  handIndices: number[],
): number[] {
  return handIndices
    .map(hi => chooseCardsHandIndexToPromptIndex(prompt, hi))
    .filter(i => i >= 0);
}

export function isChooseCardsHandIndexEligible(
  cards: Card[],
  filter: ChooseCardsPrompt['filter'],
  blocked: number[],
  index: number,
): boolean {
  if (blocked.includes(index)) {
    return false;
  }
  const card = cards[index];
  if (!card) {
    return false;
  }
  for (const key in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, key)) {
      if (
        (filter as Record<string, unknown>)[key] !==
        (card as unknown as Record<string, unknown>)[key]
      ) {
        return false;
      }
    }
  }
  return true;
}

export function chooseCardsHandIndicesToCards(
  prompt: ChooseCardsPrompt,
  indices: number[],
): Card[] {
  const cards = prompt.cards.cards;
  return indices.map(i => cards[i]);
}
