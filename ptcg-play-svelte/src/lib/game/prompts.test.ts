import { describe, expect, it } from 'vitest';
import {
  extractPromptCards,
  fieldOptions,
  isKnownPrompt,
  promptBlockedIndexes,
  promptBlockedTargets,
  promptInstanceKey,
  promptOptions,
  prunePromptIndexes,
  promptSlots,
  samePromptIndexes,
} from './prompts';
import { SlotType, targetFor, type PromptView } from './types';

describe('prompt helpers', () => {
  it('identifies migrated prompt classes as known prompts', () => {
    expect(isKnownPrompt(prompt('ConfirmPrompt'))).toBe(true);
    expect(isKnownPrompt(prompt('ChooseCardsPrompt'))).toBe(true);
    expect(isKnownPrompt(prompt('ChoosePokemonPrompt'))).toBe(false);
  });

  it('keys prompt component instances by prompt identity', () => {
    expect(promptInstanceKey(prompt('ChooseEnergyPrompt', {}, 9))).toBe('9:ChooseEnergyPrompt:');
    expect(promptInstanceKey({ ...prompt('ChooseCardsPrompt', {}, 9), message: 'CHOOSE_STARTING_POKEMONS' }))
      .toBe('9:ChooseCardsPrompt:CHOOSE_STARTING_POKEMONS');
    expect(promptInstanceKey(undefined)).toBe('');
  });

  it('normalizes prompt options and slots', () => {
    const item = prompt('ChoosePokemonPrompt', {
      slots: [SlotType.ACTIVE],
      options: { min: 1, blocked: [3] },
    });

    expect(promptOptions(item)).toEqual({ min: 1, blocked: [3] });
    expect(fieldOptions(item.fields)).toEqual({ min: 1, blocked: [3] });
    expect(promptSlots(item)).toEqual([SlotType.ACTIVE]);
    expect(promptSlots(prompt('ChoosePokemonPrompt'))).toEqual([SlotType.ACTIVE, SlotType.BENCH]);
  });

  it('extracts blocked indexes and target arrays', () => {
    const target = targetFor(0, 1, SlotType.BENCH, 2);
    const item = prompt('ChoosePokemonPrompt', {
      options: {
        blocked: [1, 'bad', 2],
        blockedTo: [target],
      },
    });

    expect(promptBlockedIndexes(item)).toEqual([1, 2]);
    expect(promptBlockedTargets(item, 'blockedTo')).toEqual([target]);
  });

  it('extracts prompt cards from card lists or energy maps', () => {
    expect(extractPromptCards({ cards: [{ index: 4, name: 'Ralts', fullName: 'Ralts SIT' }] })).toEqual([
      { index: 4, name: 'Ralts', fullName: 'Ralts SIT' },
    ]);
    expect(extractPromptCards({ energy: [{ index: 2, card: { name: 'Psychic Energy', fullName: 'Psychic Energy SVE' } }] })).toEqual([
      { index: 2, name: 'Psychic Energy', fullName: 'Psychic Energy SVE' },
    ]);
  });

  it('prunes selected prompt indexes without hiding value equality', () => {
    expect(prunePromptIndexes([1, 2, 3], (index) => index !== 2, 2)).toEqual([1, 3]);
    expect(samePromptIndexes([1, 3], [1, 3])).toBe(true);
    expect(samePromptIndexes([1, 3], [3, 1])).toBe(false);
  });
});

function prompt(className: string, fields: Record<string, unknown> = {}, id = 1): PromptView {
  return {
    id,
    className,
    type: className,
    playerId: 1,
    playerIndex: 0,
    supported: true,
    resultSchema: 'unknown',
    fields,
  };
}
