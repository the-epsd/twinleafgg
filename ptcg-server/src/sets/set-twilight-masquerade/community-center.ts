import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class CommunityCenter extends TrainerCard {
    
  public trainerType = TrainerType.STADIUM;

  public set = 'TWM';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '146';

  public name = 'Community Center';

  public fullName = 'Community Center TWM';

  public text = 'Once during each player\'s turn, if that player has already played a Supporter from their hand, they may heal 10 damage from each of their Pokémon';
        
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {

    const player = effect.player;

    // Check if player has 6 Pokemon in play
    if(player.active.cards.length + player.bench.length !== 6) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
  
    if (player.supporterTurn !== 0) {
    // Heal each Pokemon by 10 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect); 
      });
  
      return state;
  
    }
    return state;
  }
}