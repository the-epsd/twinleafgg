import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../..';

export class PanicMask extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'LOR';
  
  public set2: string = 'lostorigin';
  
  public setNumber: string = '165';
  
  public name = 'Panic Mask';
  
  public fullName = 'Panic Mask LOR';

  public text: string =
    '';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      const activePokemon = opponent.active as unknown as PokemonCard;

      if (state.phase === GamePhase.ATTACK) {
        if (activePokemon.hp <= 30) {
          effect.damage = 0;
        }
      }
    }

    return state;
  }
}