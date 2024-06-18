import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UTurnBoard extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'UNM';

  public name: string = 'U-Turn Board';

  public fullName: string = 'U-Turn Board UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '211';

  public text: string =
    "The Retreat Cost of the Pokémon this card is attached to is [C] less. If this card is discarded from play, put it into your hand instead of the discard pile.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      effect.target.moveCardTo(this, player.hand);
    }
    
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.cost.length === 0) {
        effect.cost = [];        
      } else {
        effect.cost.splice(0, 1);        
      }      
    }
    
    return state;
  }

}
