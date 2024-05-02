import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Charmeleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = 
    [{
      name: 'Flare Veil',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
    }];

  public attacks = [
    {
      name: 'Raging Flames',
      cost: [ CardType.FIRE, CardType.FIRE ],
      damage: 60,
      text: 'Discard the top 3 cards of your deck.'
    }
  ];

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '8';
  
  public set = 'PAF';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();
  
      if (pokemonCard !== this) {
        return state;
      }
  
      if (sourceCard) {
        if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {

          // Allow damage
          if (effect instanceof PutDamageEffect) {
            return state; 
          }
          // Allow damage
          if (effect instanceof DealDamageEffect) {
            return state; 
          }
      
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const player = StateUtils.findOwner(state, effect.target);
            const powerEffect = new PowerEffect(player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
      
          effect.preventDefault = true;
        }
      }
      return state;
    }
    return state;
  }
}
