import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class TheRocketsTrainingGym extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'The Rocket\'s Training Gym';
  public fullName: string = 'The Rocket\'s Training Gym G1';

  public text: string =
    'Each player pays [C] more to retreat his or her Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        effect.cost.push(CardType.COLORLESS);
      }
    }

    return state;
  }
}

