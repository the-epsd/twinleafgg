import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage } from '../../game';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class ResistanceGym extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'G2';
  public setNumber = '109';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Resistance Gym';
  public fullName: string = 'Resistance Gym G2';

  public text: string =
    'Each Pokémon\'s Resistance is reduced by 20. (If a Pokémon\'s Resistance is -30, it becomes -10.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect && StateUtils.getStadiumCard(state) === this) {
      // honestly don't understand this, but the AI cooked
      const target = effect.target.getPokemonCard();
      if (target && Array.isArray(target.resistance)) {
        // Reduce each resistance value by 20, but not below -10
        effect.resistance = target.resistance.map(res => {
          // If resistance is a number, reduce by 20, min -10
          if (typeof res.value === 'number') {
            return {
              ...res,
              value: Math.min(res.value + 20, 0)
            };
          }
          return res;
        });
      }

      if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }
    }

    return state;
  }

}
