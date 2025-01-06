import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class PracticeStudio extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '186';

  public name: string = 'Practice Studio';

  public fullName: string = 'Practice Studio PAL';

  public text: string =
    'The attacks of Stage 1 Pokémon (both yours and your opponent\'s) do 10 more damage to the opponent\’s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const pokemonCard = effect.source.getPokemonCard();
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.damage > 0 && effect.target === opponent.active && pokemonCard?.stage === Stage.STAGE_1) {
        effect.damage += 20;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    
    return state;
  }
}
