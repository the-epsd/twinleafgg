import type { PromptView } from '../lib/game/types';
import { promptSelectionStore } from './promptSelection.svelte';
import { autoConfirmDecision, promptKey } from './promptLifecycleModel';
import { selectionStore } from './selection.svelte';
import { setupSelectionStore } from './setupSelection.svelte';

class PromptLifecycleStore {
  private promptScopedKey = $state('');
  private autoConfirmKey = $state('');

  syncPromptScopedState(prompt: PromptView | undefined) {
    const nextPromptKey = promptKey(prompt);
    if (this.promptScopedKey === nextPromptKey) {
      return;
    }
    this.promptScopedKey = nextPromptKey;
    setupSelectionStore.reset();
    promptSelectionStore.reset();
  }

  resetCommandSelection(promptCount: number) {
    selectionStore.clearHandAndFocus();
    if (!promptCount) {
      setupSelectionStore.reset();
    }
  }

  shouldAutoConfirm(prompt: PromptView | undefined, eligible: boolean, resolving: boolean) {
    const decision = autoConfirmDecision(this.autoConfirmKey, prompt, eligible, resolving);
    this.autoConfirmKey = decision.autoConfirmKey;
    return decision.shouldResolve;
  }

  reset() {
    this.promptScopedKey = '';
    this.autoConfirmKey = '';
    setupSelectionStore.reset();
    promptSelectionStore.reset();
  }
}

export const promptLifecycleStore = new PromptLifecycleStore();
