import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, Stage, CardType } from '../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class PokemonLeagueHeadquarters extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set: string = 'OBF';

  public set2: string = 'obsidianflames';

  public setNumber: string = '192';

  public name: string = 'Pokémon League Headquarters';

  public fullName: string = 'Pokémon League Headquarters OBF';

  public text: string =
    'Attacks used by each Basic Pokémon in play (both yours and your opponent\'s) cost C more.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage == Stage.BASIC) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.push(index, 1);
        }
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
