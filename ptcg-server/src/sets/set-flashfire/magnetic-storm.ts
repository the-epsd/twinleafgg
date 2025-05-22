import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import {CheckPokemonStatsEffect} from '../../game/store/effects/check-effects';

export class MagneticStorm extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Magnetic Storm';
  public fullName: string = 'Magnetic Storm FLF';

  public text: string = 'Each Pokémon in play has no Resistance.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof CheckPokemonStatsEffect && StateUtils.getStadiumCard(state) === this){
      effect.resistance = [];
    }

    return state;
  }
}
