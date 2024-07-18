import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class LysandreLabs extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '111';

  public name: string = 'Lysandre Labs';

  public fullName: string = 'Lysandre Labs FLI';

  public text: string =
    ' Pokémon Tool cards in play (both yours and your opponent\'s) have no effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof ToolEffect && StateUtils.getStadiumCard(state) === this) {
      // effect.preventDefault = true;
      // effect.card.provides = [CardType.COLORLESS];
      effect.preventDefault = true;
      console.log('Lysandre Labs blocks Tool Effect');
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}
