import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class Eviolite extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'NVI';

  public name: string = 'Eviolite';

  public fullName: string = 'Eviolite NVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public text: string =
    'If the Pokemon this card is attached to is a Basic Pokemon, ' +
    'any damage done to this Pokemon by attacks is reduced by 20 ' +
    '(after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.target.tool === this && effect.target.isBasic()) {
        effect.damage -= 20;
      }
    }

    return state;
  }

}
