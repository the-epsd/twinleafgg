import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ConfirmCardsOptions {
  allowCancel: boolean;
}

export class ConfirmCardsPrompt extends Prompt<true> {

  readonly type: string = 'Confirm cards';

  public options: ConfirmCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: Card[],
    options?: Partial<ConfirmCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }

}
