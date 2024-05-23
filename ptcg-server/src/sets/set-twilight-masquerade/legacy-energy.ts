import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard, CardType, EnergyType, CardTag } from '../../game';
import { KnockOutEffect } from '../../game/store/effects/game-effects';

export class LegacyEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];
  
  public energyType = EnergyType.SPECIAL;

  public tags = [ CardTag.ACE_SPEC ];
  
  public set: string = 'TWM';
  
  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '167';
  
  public name = 'Legacy Energy';
  
  public fullName = 'Legacy Energy TWM';

  public text: string =
    'If the Pokemon this card is attached to is your Active Pokemon and is ' +
    'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
    'put 2 damage counters on the Attacking Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.tool === this) {
    //   const player = effect.player;
    //   const targetPlayer = StateUtils.findOwner(state, effect.target);

      //   if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
      //     return state;
      //   }

      if (state.phase === GamePhase.ATTACK) {
        effect.prizeCount -= 1;
      }
    }

    return state;
  }

}
