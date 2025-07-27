import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Repel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'M1L';
  public setNumber = '60';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'I';
  public name: string = 'Repel';
  public fullName: string = 'Repel M1L';

  public text: string = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    return state;
  }

}
