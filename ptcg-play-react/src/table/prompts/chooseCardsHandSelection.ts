import type { Card, ChooseCardsPrompt } from 'ptcg-server';
import { GameMessage } from 'ptcg-server';

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
