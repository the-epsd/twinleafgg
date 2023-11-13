import { TrainerCard, TrainerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Pokegear30 extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType: TrainerType = TrainerType.ITEM;
  
  public set: string = 'SVI';
  
  public set2: string = 'scarletviolet';
  
  public setNumber: string = '186';
  
  public name: string = 'Pokegear 3.0';
  
  public fullName: string = 'Pokegear SVI';
  
  public text: string =
    'Look at the top 7 cards of your deck. You may reveal a Supporter card ' +
      'you find there and put it into your hand. Shuffle the other cards back ' +
      'into your deck.';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Heal each Pokemon by 10 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect); 
      });
    
      return state;
    
    }
    return state;
  }
}