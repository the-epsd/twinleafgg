import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from '../../game/store/prefabs/prefabs';

export class Repel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'MEG';
  public setNumber = '126';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'I';
  public name: string = 'Repel';
  public fullName: string = 'Repel M1L';
  public text: string = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Legacy implementation:
      // - Called SWITCH_ACTIVE_WITH_BENCHED against opponent player directly.
      //
      // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, { allowCancel: false });
    }

    return state;
  }

}
