import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Postwick extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'SV9';

  public name: string = 'Postwick';

  public fullName: string = 'Postwick SV9';

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '99';

  public text: string =
    'The attacks of Hop\'s Pokémon (both yours and your opponent\'s) do 30 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // checking if this is targeting the active
      if (effect.target !== opponent.active) {
        return state;
      }

      // 'not a hopper' border checkpoint
      if (!effect.source.getPokemonCard()?.tags.includes(CardTag.HOPS)) {
        return state;
      }

      effect.damage += 30;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}