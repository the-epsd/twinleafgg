import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class PotHelmet extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'F';

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '146';

  public name: string = 'Pot Helmet';

  public fullName: string = 'Pot Helmet BRS';

  public text: string =
    'If the Pokémon this card is attached to doesn\'t have a Rule Box, it takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.target.getPokemonCard();

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      if (effect.damageReduced) {
        // Damage already reduced, don't reduce again
        return state; 
      }
    
      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR || sourceCard.tags.includes(CardTag.POKEMON_ex || CardTag.RADIANT))) {
        return state;
      }
    
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

}
