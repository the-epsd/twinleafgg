import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';


export class BossOrders extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '172';

  public name: string = 'Boss\'s Orders';

  public fullName: string = 'Boss\'s Orders PAL';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
    'Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      // Legacy implementation:
      // - Used a manual ChoosePokemonPrompt and optional TrainerTargetEffect redirect.
      // - Switched opponent Active to chosen Benched target.
      //
      // Converted to prefab version (SWITCH_IN_OPPONENT_BENCHED_POKEMON).
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, { allowCancel: false });
    }
    return state;
  }

}
