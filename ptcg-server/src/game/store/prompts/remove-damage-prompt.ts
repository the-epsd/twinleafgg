import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { DamageMap, DamageTransfer } from './move-damage-prompt';

export const RemoveDamagePromptType = 'Remove damage';

export type RemoveDamageResultType = DamageTransfer[];

// export interface DamageTransfer {
//   from: CardTarget;
//   to: CardTarget;
// }

// export interface DamageMap {
//   target: CardTarget;
//   damage: number;
// }

export interface RemoveDamageOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
  sameTarget: boolean;
}

export class RemoveDamagePrompt extends Prompt<DamageTransfer[]> {

  readonly type: string = RemoveDamagePromptType;

  public options: RemoveDamageOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public maxAllowedDamage: DamageMap[],
    options?: Partial<RemoveDamageOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedTo: [],
      sameTarget: false
    }, options);
  }

  public decode(result: RemoveDamageResultType | null, state: State): DamageTransfer[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result;
  }

  public validate(result: DamageTransfer[] | null, state: State): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }

    if (result.length < this.options.min) {
      return false;
    }

    if (this.options.max !== undefined && result.length > this.options.max) {
      return false;
    }

    // Check if all targets are the same
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some(r => {
        return r.to.player !== t.player
          || r.to.slot !== t.slot
          || r.to.index !== t.index;
      });
      if (different) {
        return false;
      }
    }

    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    const blockedFrom = this.options.blockedFrom.map(b => StateUtils.getTarget(state, player, b));
    const blockedTo = this.options.blockedTo.map(b => StateUtils.getTarget(state, player, b));

    for (const r of result) {
      const from = StateUtils.getTarget(state, player, r.from);
      if (from === undefined || blockedFrom.includes(from)) {
        return false;
      }
      const to = StateUtils.getTarget(state, player, r.to);
      if (to === undefined || blockedTo.includes(to)) {
        return false;
      }
    }

    if (this.playerType !== PlayerType.ANY) {
      if (result.some(r => r.from.player !== this.playerType)
        || result.some(r => r.to.player !== this.playerType)) {
        return false;
      }
    }

    if (result.some(r => !this.slots.includes(r.from.slot))
      || result.some(r => !this.slots.includes(r.to.slot))) {
      return false;
    }

    return true;
  }

}
