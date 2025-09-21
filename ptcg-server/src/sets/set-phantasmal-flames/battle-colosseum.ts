import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';

export class BattleColosseum extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'I';
  public set: string = 'M2';
  public name: string = 'Battle Colosseum';
  public fullName: string = 'Battle Colosseum M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public text: string = 'Prevent all damage counters from being placed on Benched Pokemon (both yours and your opponent\'s) by the effects of the attacks or Abilities used by the opponent\'s Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Also prevent damage counters from effects like PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE
    if (effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const sourcePokemon = effect.source;

      // Check if the source is the opponent's Pokemon
      if (sourcePokemon && opponent.active === sourcePokemon) {
        // Check if the target is a benched Pokemon (not active)
        if (effect.target !== player.active && effect.target !== opponent.active) {
          // Prevent damage counters to benched Pokemon from opponent's attacks/abilities
          effect.preventDefault = true;
        }
      }
    }
    return state;
  }
}
