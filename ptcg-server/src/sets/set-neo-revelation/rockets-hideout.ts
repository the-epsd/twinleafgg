import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class RocketsHideout extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'N3';
  public name: string = 'Rocket\'s Hideout';
  public fullName: string = 'Rocket\'s Hideout N3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';

  public text: string =
    'Each Pokémon in play with Dark in its name (even your opponent\'s) gets +20 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect.target.getPokemonCard()?.tags.includes(CardTag.DARK)) {
        effect.hp += 20;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
