import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class GalarMine extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'D';

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public name: string = 'Galar Mine';

  public fullName: string = 'Galar Mine RCL';

  public text: string = 'The Retreat Cost of both Active Pokémon is [C][C] more.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const playerActive = player.active.getPokemonCard();

      if (playerActive) {
        effect.cost.push(CardType.COLORLESS, CardType.COLORLESS);
      }
      return state;
    }
    return state;
  }
}