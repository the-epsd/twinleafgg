import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class EmergencyBoard extends TrainerCard {

  public regulationMark = 'H';
  
  public trainerType: TrainerType = TrainerType.ITEM;
  
  public set: string = 'SV5K';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '64';
  
  public name: string = 'Emergency Board';
  
  public fullName: string = 'Emergency Board SV5K';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard && pokemonCard.hp <= 30) {
        effect.cost = [];
      } else {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
        return state;
      }
      return state;
    }
    return state;

  }
}