import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ShowCardsOptions {
  allowCancel: boolean;
  /**
   * Player who physically owns the revealed cards (deck / hand / discard).
   * Distinct from {@link Prompt.playerId}, who is the viewer.
   */
  sourcePlayerId?: number;
}

export class ShowCardsPrompt extends Prompt<true> {

  readonly type: string = 'Show cards';

  public options: ShowCardsOptions;

  /** Player who owns the revealed cards. Copied from options for client animation origin. */
  public sourcePlayerId?: number;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: Card[],
    options?: Partial<ShowCardsOptions>
  ) {
    super(playerId);

    this.sourcePlayerId = options?.sourcePlayerId;
    // Default options
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }
}
