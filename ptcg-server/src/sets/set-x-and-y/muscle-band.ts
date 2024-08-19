import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
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
    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
