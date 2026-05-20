import type { EngineResponse, GameView } from '../lib/game/types';

class GameStore {
  game = $state<GameView | null>(null);
  error = $state('');
  busy = $state(false);
  resolvingPrompt = $state(false);

  get currentPrompt() {
    return this.game?.prompts[0];
  }

  get gameFinished() {
    return this.game?.phase === 7;
  }

  setError(message: string) {
    this.error = message;
  }

  reset() {
    this.game = null;
    this.error = '';
    this.busy = false;
    this.resolvingPrompt = false;
  }

  async run(command: () => Promise<EngineResponse>) {
    this.busy = true;
    try {
      return this.apply(await command());
    } finally {
      this.busy = false;
    }
  }

  async resolve(command: () => Promise<EngineResponse>) {
    this.resolvingPrompt = true;
    try {
      return this.apply(await command());
    } finally {
      this.resolvingPrompt = false;
    }
  }

  private apply(response: EngineResponse) {
    if (response.ok) {
      this.game = response.view;
      this.error = '';
      return response;
    }

    this.error = response.error;
    if (response.view) {
      this.game = response.view;
    }
    return response;
  }
}

export const gameStore = new GameStore();
