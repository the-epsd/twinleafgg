import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class KarateBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'UNM';

  public name: string = 'Karate Belt';

  public fullName: string = 'Karate Belt UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '201';

  public text: string =
    'If you have more Prize cards remaining than your opponent, the attacks of the Pokémon this card is attached to cost [F] less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const index = effect.cost.indexOf(CardType.FIGHTING);

      // No cost to reduce
      if (index === -1) {
        return state;
      }

      if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
        effect.cost.splice(index, 1);        
      }      

      return state;
    }

    return state;
  }
}
