import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StateUtils } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class VengefulPunch extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'OBF';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '197';
  
  public name = 'Vengeful Punch';
  
  public fullName = 'Vengeful Punch OBF';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 4 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);
  
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }
  
      const activePokemon = player.active as unknown as PokemonCard;
      const maxHp = activePokemon.hp;
  
      if (state.phase === GamePhase.ATTACK) {
        if (player.active.damage >= maxHp) {
          effect.source.damage += 40;
        }
      }
    }
  
    return state;
  }
}