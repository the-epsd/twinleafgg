import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class FloatStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PLF';

  public name: string = 'Float Stone';

  public fullName: string = 'Float Stone PLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '99';

  public text: string =
    'The Pokemon this card is attached to has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    return state;
  }

}
