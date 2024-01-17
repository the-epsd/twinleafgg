import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class ChampionsFestival extends TrainerCard {
  public trainerType = TrainerType.STADIUM;

  public set = 'SWSH';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '296';

  public name = 'Champion\'s Festival';

  public fullName = 'Champion\'s Festival SWSH';

  public text = 'Once during each player\'s turn, if that player has ' + 
    '6 Pokémon in play, they may heal 10 damage from ' +
    'each of their Pokémon. ';
        
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {

    const player = effect.player;

    // Check if player has 6 Pokemon in play
    if(player.active.cards.length + player.bench.length !== 6) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
  
    // Heal each Pokemon by 10 damage
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const healEffect = new HealEffect(player, cardList, 10);
      state = store.reduceEffect(state, healEffect); 
    });
  
    return state;
  
  }
}