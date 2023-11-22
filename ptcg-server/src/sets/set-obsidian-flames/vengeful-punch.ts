import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game';

export class VengefulPunch extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'OBF';
  
  public set2: string = 'obsidianflames';
  
  public setNumber: string = '197';
  
  public name = 'Vengeful Punch';
  
  public fullName = 'Vengeful Punch OBF';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 4 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      // eslint-disable-next-line indent
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const targetPlayer = player.active;

      if (effect instanceof KnockOutEffect && targetPlayer === effect.target) {
        opponent.active.damage += 40;
      }
    }

    return state;
  }
}
