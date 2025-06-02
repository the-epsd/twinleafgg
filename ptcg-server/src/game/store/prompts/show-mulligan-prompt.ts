import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ShowMulliganOptions {
  allowCancel: boolean;
}

export class ShowMulliganPrompt extends Prompt<true> {

  readonly type: string = 'Show mulligan';

  public options: ShowMulliganOptions;
  public hands: Card[][];

  constructor(
    playerId: number,
    public message: GameMessage,
    hands: Card[][],
    options?: Partial<ShowMulliganOptions>
  ) {
    super(playerId);
    this.hands = hands;
    // Default options
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }
}
