import { describe, expect, it } from 'vitest';
import { autoConfirmDecision, promptKey } from './promptLifecycleModel';
import type { PromptView } from '../lib/game/types';

const prompt: PromptView = {
  id: 7,
  className: 'ConfirmPrompt',
  type: 'confirm',
  playerId: 1,
  playerIndex: 0,
  supported: true,
  resultSchema: 'boolean',
  fields: {},
};

describe('prompt lifecycle model', () => {
  it('keys prompt-scoped state by prompt id and class', () => {
    expect(promptKey(prompt)).toBe('7:ConfirmPrompt');
    expect(promptKey(undefined)).toBe('');
  });

  it('claims each eligible auto-confirm prompt once', () => {
    const first = autoConfirmDecision('', prompt, true, false);
    expect(first).toEqual({ autoConfirmKey: '7:ConfirmPrompt', shouldResolve: true });

    const second = autoConfirmDecision(first.autoConfirmKey, prompt, true, false);
    expect(second).toEqual({ autoConfirmKey: '7:ConfirmPrompt', shouldResolve: false });
  });

  it('holds the current auto-confirm key while a prompt is resolving', () => {
    expect(autoConfirmDecision('7:ConfirmPrompt', prompt, true, true)).toEqual({
      autoConfirmKey: '7:ConfirmPrompt',
      shouldResolve: false,
    });
  });

  it('clears the auto-confirm key when the prompt is no longer eligible', () => {
    expect(autoConfirmDecision('7:ConfirmPrompt', prompt, false, false)).toEqual({
      autoConfirmKey: '',
      shouldResolve: false,
    });
  });
});
