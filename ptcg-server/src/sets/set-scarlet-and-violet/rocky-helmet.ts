import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class RockyHelmet extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'SVI';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '193';
  
  public name = 'Rocky Helmet';
  
  public fullName = 'Rocky Helmet SVI';

  public text: string =
    'If the Pokemon this card is attached to is your Active Pokemon and is ' +
    'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
    'put 2 damage counters on the Attacking Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 20;
      }
    }

    return state;
  }

}
