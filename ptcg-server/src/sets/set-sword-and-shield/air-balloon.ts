import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class AirBalloon extends TrainerCard {

  public regulationMark = 'D';
  
  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'SSH';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '156';
  
  public name: string = 'Air Balloon';
  
  public fullName: string = 'Air Balloon SSH';

  public text: string = 'The Retreat Cost of the Pokémon this card is attached to is [C][C] less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const index = effect.cost.indexOf(CardType.COLORLESS);
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (index !== -1) {
        effect.cost.splice(index, 2);
      }
      return state;
    }
    return state;
  }

}
