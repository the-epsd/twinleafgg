import { describe, expect, it } from 'vitest';
import {
  extractPromptCards,
  fieldOptions,
  isKnownPrompt,
  promptBlockedIndexes,
  promptBlockedTargets,
  promptOptions,
  promptSlots,
} from './prompts';
import { SlotType, targetFor, type PromptView } from './types';

describe('prompt helpers', () => {
  it('identifies migrated prompt classes as known prompts', () => {
    expect(isKnownPrompt(prompt('ConfirmPrompt'))).toBe(true);
    expect(isKnownPrompt(prompt('ChooseCardsPrompt'))).toBe(true);
    expect(isKnownPrompt(prompt('ChoosePokemonPrompt'))).toBe(false);
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
});

function prompt(className: string, fields: Record<string, unknown> = {}): PromptView {
  return {
    id: 1,
    className,
    type: className,
    playerId: 1,
    playerIndex: 0,
    supported: true,
    resultSchema: 'unknown',
    fields,
  };
}
