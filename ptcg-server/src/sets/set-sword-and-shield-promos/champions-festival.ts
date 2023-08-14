import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { HealEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { PokemonCardList } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class ChampionsFestival extends TrainerCard {
  trainerType = TrainerType.STADIUM;
  set = 'SWSH';
  name = 'Champion\'s Festival';
  fullName = 'Champion\'s Festival SWSH296';
  text = 'Once during each player\'s turn, if that player has ' + 
    '6 Pokémon in play, they may heal 10 damage from ' +
    'each of their Pokémon. ';
    
  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }
    
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;
    if (player.active.cards.length + player.bench.length < 5) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
                                                                                                                                    
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
      const healEffect = new HealEffect(player, cardList, 10);
      state = store.reduceEffect(state, healEffect);
    });
    return state; 
  }
}
