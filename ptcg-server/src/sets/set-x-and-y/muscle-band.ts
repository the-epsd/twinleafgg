import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MuscleBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'XY';

  public name: string = 'Muscle Band';

  public fullName: string = 'Muscle Band XY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public text: string =
    'The attacks of the Pokemon this card is attached to do 20 more ' +
    'damage to our opponent\'s Active Pokemon (before aplying Weakness ' +
    'and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const attack = effect.attack;
      if (attack && attack.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
