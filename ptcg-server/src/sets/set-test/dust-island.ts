import { StoreLike, State, TrainerCard, TrainerType, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
export class DustIsland extends TrainerCard {

  public regulationMark = 'H';
  
  public cardImage: string = 'https://assets.pokemon.com/assets/cms2/img/cards/web/SM10/SM10_EN_168.png';
  
  public setNumber: string = '1';
    
  public trainerType = TrainerType.STADIUM;
  
  public set = 'TEST';
  
  public name = 'Dust Island';
  
  public fullName = 'Dust Island TEST';
  
  public text = 'Whenever either player switches their Poisoned Active Pokémon with 1 of their Benched Pokémon with the effect of a Trainer card, the new Active Pokémon is now affected by that Special Condition.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
