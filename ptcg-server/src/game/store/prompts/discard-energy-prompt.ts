import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { FilterType } from './choose-cards-prompt';

export const DiscardEnergyPromptType = 'Discard energy';

export type DiscardEnergyResultType = { from: CardTarget, to: CardTarget, index: number }[];

export interface DiscardEnergyTransfer {
  from: CardTarget;
  to: CardTarget;
  card: Card;
}

export interface DiscardEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
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
      blockedTo: [],
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
      transfers.push({ from: t.from, to: t.to, card });
    });
    return transfers;
  }

  public validate(result: DiscardEnergyTransfer[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    return result.every(r => r.card !== undefined);
  }

}
