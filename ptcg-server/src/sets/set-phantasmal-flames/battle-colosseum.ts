import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';

export class BattleColosseum extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Battle Cage';
  public fullName: string = 'Battle Colosseum M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public text: string = 'Prevent all damage counters from being placed on Benched Pokémon (both yours and your opponent\'s) by effects of attacks and Abilities from the opponent\'s Pokémon. (Damage from attacks is still taken.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Also prevent damage counters from effects like PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE
    if (effect instanceof PutCountersEffect && StateUtils.getStadiumCard(state) === this) {
      const sourcePokemon = effect.source;

      // Check if the source belongs to the opponent of the target's owner
      if (sourcePokemon) {
        const targetOwner = StateUtils.findOwner(state, effect.target);
        const targetOpponent = StateUtils.getOpponent(state, targetOwner);
        const sourceOwner = StateUtils.findOwner(state, sourcePokemon);
        if (sourceOwner === targetOpponent) {
          // Check if the target is a benched Pokemon (not active)
          if (effect.target !== targetOwner.active && effect.target !== targetOpponent.active) {
            // Prevent damage counters to benched Pokemon from opponent's attacks/abilities
            effect.preventDefault = true;
          }
        }
      }
    }

    if (effect instanceof PlaceDamageCountersEffect && StateUtils.getStadiumCard(state) === this) {
      // Check if the source is provided and belongs to the opponent of the target's owner
      if (effect.source) {
        const sourceCardList = StateUtils.findPokemonSlot(state, effect.source);
        if (sourceCardList) {
          const targetOwner = StateUtils.findOwner(state, effect.target);
          const targetOpponent = StateUtils.getOpponent(state, targetOwner);
          const sourceOwner = StateUtils.findOwner(state, sourceCardList);
          if (sourceOwner === targetOpponent) {
            // Check if the target is a benched Pokemon (not active)
            if (effect.target !== targetOwner.active && effect.target !== targetOpponent.active) {
              // Prevent damage counters to benched Pokemon from opponent's attacks/abilities
              effect.preventDefault = true;
            }
          }
        }
      }
    }


    return state;
  }
}
