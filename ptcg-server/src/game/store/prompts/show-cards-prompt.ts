import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ShowCardsOptions {
  allowCancel: boolean;
  duration?: number; // Duration in milliseconds before auto-confirming
}

export class ShowCardsPrompt extends Prompt<true> {

  readonly type: string = 'Show cards';

  public options: ShowCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: Card[],
    options?: Partial<ShowCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: false,
      duration: 3000 // Default 3 seconds
    }, options);
  }

}
