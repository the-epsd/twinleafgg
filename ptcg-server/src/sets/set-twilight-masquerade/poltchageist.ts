import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Poltchageist extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 30;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Storehouse Hideaway',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks from your opponent\'s Pokémon done to this Pokémon.'
  }];

  public attacks = [{ 
    name: 'Hook', 
    cost: [ CardType.GRASS ], 
    damage: 10, 
    text: '' 
  }];

  public set: string = 'TWM';
  public name: string = 'Poltchageist';
  public fullName: string = 'Poltchageist TWM';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }
  
      // why must i always ability lock check also is the only reason rs-pk is loved is how many things have poke-body/power lock it seems like everything in that format just has that 
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
  
      // Target is this
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        // why must i always ability lock check also is the only reason rs-pk is loved is how many things have poke-body/power lock it seems like everything in that format just has that 
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
  
        effect.preventDefault = true;
      }
    }

    return state;
  }
  
}