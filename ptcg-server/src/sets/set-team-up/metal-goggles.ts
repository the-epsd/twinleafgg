import { StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';

export class MetalGoggles extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Metal Goggles';

  public fullName: string = 'Metal Goggles TEU';

  public text: string =
    'The [M] Pokémon this card is attached to takes 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance), and your opponent\'s attacks and Abilities can\'t put damage counters on it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.target.getPokemonCard();

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
    
      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (sourceCard) {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonTypeEffect);
  
        if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
          // Check if damage target is owned by this card's owner 
          const targetPlayer = StateUtils.findOwner(state, effect.target);
          if (targetPlayer === player) {
            effect.damage = Math.max(0, effect.damage - 30);
            effect.damageReduced = true;
          }
          
          return state;   
        }
      }
    }
  
    if (effect instanceof PutCountersEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.target.getPokemonCard();

      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (sourceCard) {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonTypeEffect);
  
        if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
          // Check if damage target is owned by this card's owner 
          const targetPlayer = StateUtils.findOwner(state, effect.target);
          if (targetPlayer === player) {
            effect.preventDefault = true;
          }
          
          return state;   
        }
      }
    }
    return state;
  }

}
