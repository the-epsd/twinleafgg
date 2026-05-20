import type { PromptView } from '../lib/game/types';

export type AutoConfirmDecision = {
  autoConfirmKey: string;
  shouldResolve: boolean;
};

export function promptKey(prompt: PromptView | undefined) {
  return prompt ? `${prompt.id}:${prompt.className}` : '';
}

export function autoConfirmDecision(
  currentKey: string,
  prompt: PromptView | undefined,
  eligible: boolean,
  resolving: boolean,
): AutoConfirmDecision {
  if (!eligible) {
    return { autoConfirmKey: '', shouldResolve: false };
  }
  if (!prompt || resolving) {
    return { autoConfirmKey: currentKey, shouldResolve: false };
  }
  const nextKey = promptKey(prompt);
  return {
    autoConfirmKey: nextKey,
    shouldResolve: currentKey !== nextKey,
  };
}
