import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class AncientTomb extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'HL';
  public setNumber = '87';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Ancient Tomb';
  public fullName: string = 'Ancient Tomb HL';

  public text: string =
    'Don\'t apply Weakness for all Pokémon in play (excluding Pokémon-ex and Pokémon that has an owner in its name).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect && StateUtils.getStadiumCard(state) === this) {

      const target = effect.target.getPokemonCard();
      if (!target?.tags.includes(CardTag.POKEMON_ex) && !target?.name.includes('\'s')) {
        effect.weakness = [];
      }

      if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }
    }

    return state;
  }

}
