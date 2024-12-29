import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class JammingTower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'H';

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '153';

  public name: string = 'Jamming Tower';

  public fullName: string = 'Jamming Tower TWM';

  public text: string =
    'Pokémon Tools attached to each Pokémon (both yours and your opponent\'s) have no effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof ToolEffect && StateUtils.getStadiumCard(state) === this) {
      effect.preventDefault = true;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}
