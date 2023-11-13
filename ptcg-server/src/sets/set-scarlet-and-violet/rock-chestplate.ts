import { CardType, TrainerType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class RockChestplate extends EnergyCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SVI';

  public set2: string = 'scarletviolet';

  public setNumber: string = '192';

  public name = 'Rock Chestplate';

  public fullName = 'Rock Chestplate SVI';

  public text =
    'The F Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage by 30
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
  
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      const player = StateUtils.findOwner(state, effect.target);
      const sourceCard = player.active.getPokemonCard();
      if (sourceCard?.cardType == CardType.FIGHTING) {
  
        // Check if damage target is owned by this card's owner 
        const targetPlayer = StateUtils.findOwner(state, effect.target);
        if (targetPlayer === player) {
          effect.damage = Math.max(0, effect.damage - 30);
          effect.damageReduced = true;
        }
  
        return state;
      }
      return state;
    }
    return state;
  }
}
  
    