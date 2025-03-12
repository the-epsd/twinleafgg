import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { FilterType } from './choose-cards-prompt';
import { SuperType } from '../card/card-types';

export const DiscardEnergyPromptType = 'Discard energy';

export type DiscardEnergyResultType = { from: CardTarget, index: number }[];

export interface DiscardEnergyTransfer {
  from: CardTarget;
  card: Card;
}

export interface DiscardEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedMap: { source: CardTarget, blocked: number[] }[];
}

export class DiscardEnergyPrompt extends Prompt<DiscardEnergyTransfer[]> {

  readonly type: string = DiscardEnergyPromptType;

  public options: DiscardEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<DiscardEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedMap: [],
    }, options);
  }

  public decode(result: DiscardEnergyResultType | null, state: State): DiscardEnergyTransfer[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: DiscardEnergyTransfer[] = [];
    result.forEach(t => {
      const cardList = StateUtils.getTarget(state, player, t.from);
      const card = cardList.cards[t.index];
      // Verify this is a card.
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      // Verify card is an energy card
      if (card.superType !== SuperType.ENERGY) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ from: t.from, card });
    });
    return transfers;
  }

  public validate(result: DiscardEnergyTransfer[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    if (result.length < this.options.min || (this.options.max !== undefined && result.length > this.options.max)) {
      return false;
    }
    return result.every(r => r.card !== undefined);
  }
}
