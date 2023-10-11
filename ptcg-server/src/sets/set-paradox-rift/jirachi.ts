import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';

export class Jirachi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Stellar Veil',
    powerType: PowerType.ABILITY,
    text: 'Attacks from your opponent\'s Basic Pokémon can\'t put damage counters on your Benched Pokémon.'
  }
  ];

  public attacks = [{
    name: 'Charge Energy',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }
  ];

  public set: string = 'PAR';

  public set2: string = 'ragingsurf';

  public setNumber: string = '42';

  public name: string = 'Jirachi';

  public fullName: string = 'Jirachi PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Override reduceEffect
      store.reduceEffect = (state, effect) => {

        // Check if effect is a damage effect
        if (effect instanceof PutDamageEffect || effect instanceof AttackEffect && effect.target === player.bench) {
          effect.damage = 0;
        }
        
        // Call original reduceEffect 
        return this.reduceEffect(store, state, effect);
      };
    }
    return state;
  }
}