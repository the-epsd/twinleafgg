import { TrainerCard, TrainerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class PicnicBasket extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType: TrainerType = TrainerType.ITEM;
  
  public set: string = 'SVI';
  
  public set2: string = 'scarletviolet';
  
  public setNumber: string = '184';
  
  public name: string = 'Picnic Basket';
  
  public fullName: string = 'Picnic Basket SVI';
  
  public text: string =
    'Heal 30 damage from each Pokémon (both yours and your opponent\'s).';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Heal each Pokemon by 30 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        state = store.reduceEffect(state, healEffect); 
      });
    
      return state;
    
    }
    return state;
  }
}