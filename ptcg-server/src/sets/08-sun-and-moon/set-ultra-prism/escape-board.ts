import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { RetreatEffect, RetreatStartEffect } from '../../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class EscapeBoard extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'UPR';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Escape Board';
  public fullName: string = 'Escape Board UPR';
  public text: string =
    "The Retreat Cost of the Pokémon this card is attached to is [C] less, and it can retreat even if it's Asleep or Paralyzed.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tools.includes(this)) {
      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.cost.length > 0) {
        effect.cost.splice(0, 1);
      }
    }

    if ((effect instanceof RetreatStartEffect || effect instanceof RetreatEffect) &&
      effect.player.active.tools.includes(this)) {
      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      effect.ignoreStatusConditions = true;
    }

    return state;
  }
}
