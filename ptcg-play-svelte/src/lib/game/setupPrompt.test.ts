import { describe, expect, it } from 'vitest';
import { getSetupPromptUiState, setupPromptResult } from './setupPrompt';
import { SlotType, targetFor, type PlayerView } from './types';

function playerWithActive(activeEmpty: boolean): PlayerView {
  return {
    index: 0,
    id: 1,
    name: 'A',
    hand: [],
    deckCount: 0,
    discard: [],
    lostZone: [],
    stadium: [],
    playZone: [],
    prizesLeft: 6,
    playableCardIds: [],
    active: {
      ownerIndex: 0,
      slot: 'active',
      index: 0,
      target: targetFor(0, 0, SlotType.ACTIVE),
      empty: activeEmpty,
      cards: activeEmpty ? [] : [{ name: 'Dreepy', fullName: 'Dreepy TWM' }],
      pokemon: activeEmpty ? undefined : { name: 'Dreepy', fullName: 'Dreepy TWM' },
      damage: 0,
      hp: 70,
      retreat: [],
      energy: [],
      tools: [],
      specialConditions: [],
    },
    bench: [],
  };
}

describe('setup prompt UI state', () => {
  it('requires an Active for initial setup prompts', () => {
    const state = getSetupPromptUiState({ min: 1, max: 6 }, playerWithActive(true), null);
    expect(state.needsActive).toBe(true);
    expect(state.canConfirm).toBe(false);
    expect(state.benchCapacity).toBe(5);
  });

  it('allows empty confirmation for optional extra bench placement after a mulligan draw', () => {
    const state = getSetupPromptUiState({ min: 0, max: 1 }, playerWithActive(false), null);
    expect(state.needsActive).toBe(false);
    expect(state.canConfirm).toBe(true);
    expect(state.benchCapacity).toBe(1);
    expect(setupPromptResult(state.hasEngineActive, null, [])).toEqual([]);
  });
});
