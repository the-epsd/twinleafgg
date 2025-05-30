import { CardList } from '../store/state/card-list';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { StateLog } from '../store/state/state-log';
import { State } from '../store/state/state';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { GameLog } from '../game-message';


export class Arbiter {

  constructor() { }

  public resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);

    if (player === undefined) {
      return;
    }

    if (prompt instanceof ShuffleDeckPrompt) {
      const result = this.shuffle(player.deck);
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof CoinFlipPrompt) {
      const result = Math.round(Math.random()) === 0;
      const message = result
        ? GameLog.LOG_PLAYER_FLIPS_HEADS
        : GameLog.LOG_PLAYER_FLIPS_TAILS;
      const log = new StateLog(message, { name: player.name });
      return new ResolvePromptAction(prompt.id, result, log);
    }
  }

  private shuffle(cards: CardList): number[] {
    const len = cards.cards.length;
    const order: number[] = [];
    // Initialize the order array with indices 0 to len - 1
    for (let i = 0; i < len; i++) {
      order.push(i);
    }
    // Fisher-Yates Shuffle
    for (let i = len - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = order[i];
      order[i] = order[j];
      order[j] = tmp;
    }
    return order;
  }

  public cleanup(): void {
    // Reset any internal state if needed
  }
}
