import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Maractus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Mega Drain',
      cost: [G],
      damage: 20,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Pin Missile',
      cost: [G, G, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Maractus';
  public fullName: string = 'Maractus BLW 11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 20 * heads;
      });
    }

    return state;
  }
}
