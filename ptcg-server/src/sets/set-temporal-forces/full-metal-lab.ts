import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class FullMetalLab extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark: string = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Full Metal Lab';

  public fullName: string = 'Full Metal Lab TEF';

  public text: string =
    '[M] Pokémon (both yours and your opponent\'s) take 30 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
        effect.damage = Math.max(0, effect.damage - 30);
        effect.damageReduced = true;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
