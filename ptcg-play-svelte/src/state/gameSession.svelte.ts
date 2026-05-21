import type { EngineResponse } from '../lib/game/types';
import { gameStore } from './game.svelte';
import { promptLifecycleStore } from './promptLifecycle.svelte';
import { selectionStore } from './selection.svelte';

class GameSessionStore {
  async run(command: () => Promise<EngineResponse>) {
    const response = await gameStore.run(command);
    this.afterCommand(response);
    return response;
  }

  async resolve(command: () => Promise<EngineResponse>) {
    const response = await gameStore.resolve(command);
    this.afterCommand(response);
    return response;
  }

  reset() {
    gameStore.reset();
    selectionStore.clearAll();
    promptLifecycleStore.reset();
  }

  syncExternalUpdate() {
    if (gameStore.game) {
      this.afterCommand({ ok: true, view: gameStore.game });
    }
  }

  private afterCommand(response: EngineResponse) {
    promptLifecycleStore.syncPromptScopedState(response.view?.prompts[0] ?? gameStore.game?.prompts[0]);
    promptLifecycleStore.resetCommandSelection(response.view?.prompts.length ?? gameStore.game?.prompts.length ?? 0);
  }
}

export const gameSessionStore = new GameSessionStore();
