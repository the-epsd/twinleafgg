import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class SidneysStadium extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'PK';
  public name: string = 'Sidney\'s Stadium';
  public fullName: string = 'Sidney\'s Stadium PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';

  public text: string =
    'Each player\'s [D] Pokémon can\'t be Asleep, Confused, or Paralyzed.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      state.players.forEach(player => {
        if (!player.active.specialConditions.includes(SpecialCondition.ASLEEP) &&
          !player.active.specialConditions.includes(SpecialCondition.CONFUSED) &&
          !player.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
          return;
        }

        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            if (condition === SpecialCondition.ASLEEP ||
              condition === SpecialCondition.CONFUSED ||
              condition === SpecialCondition.PARALYZED) {
              player.active.removeSpecialCondition(condition);
            }
          });
        }
      });
      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
