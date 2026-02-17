import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED,
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED
} from '../../game/store/prefabs/attack-effects';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kakuna';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [
    {
      name: 'Swift Sting',
      cost: [G],
      damage: 20,
      damageCalculation: '+' as const,
      text: 'If this Pokémon has full HP, this attack does 40 more damage, and the Defending Pokémon is now Confused and Poisoned.'
    },
    {
      name: 'Pierce',
      cost: [C, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beedrill';
  public fullName: string = 'Beedrill PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Swift Sting - if full HP, +40 damage, confuse and poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.active.damage === 0) {
        effect.damage += 40;
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      }
    }

    return state;
  }
}
