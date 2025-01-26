import { PokemonCard } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GraniteCave extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Granite Cave';
  public fullName: string = 'Granite Cave SVOD';

  public text: string =
    'Steven\'s Pokémon (both yours and your opponent\'s) take 30 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const card = effect.target.getPokemonCard() as PokemonCard;

      if (card.tags.includes(CardTag.STEVENS)) {
        effect.damage = Math.max(0, effect.damage - 30);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
