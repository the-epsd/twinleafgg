import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Jigglypuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sing',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Double Slap',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jigglypuff';
  public fullName: string = 'Jigglypuff NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Double Slap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = heads * 20;
      });
    }

    return state;
  }
}
