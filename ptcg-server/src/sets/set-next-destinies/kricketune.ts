import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kricketot';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'White Noise',
      cost: [C],
      damage: 20,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Draining Cut',
      cost: [G, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 40 damage times the number of heads. Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // White Noise
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Draining Cut
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        const damage = heads * 40;
        (effect as AttackEffect).damage = damage;

        if (damage > 0) {
          HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage);
        }
      });
    }

    return state;
  }
}
