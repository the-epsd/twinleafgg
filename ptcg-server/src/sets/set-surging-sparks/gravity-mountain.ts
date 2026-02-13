import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, Stage } from '../../game/store/card/card-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class GravityMountain extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'H';
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '177';
  public name: string = 'Gravity Mountain';
  public fullName: string = 'Gravity Mountain SSP';

  public text: string =
    'Each Stage 2 Pokémon in play (both yours and your opponent\'s) gets -30 HP. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect.target.getPokemonCard()?.stage === Stage.STAGE_2)
        effect.hp -= 30;
    }


    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}
