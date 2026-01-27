import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Maractus2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Constant Rattle',
      cost: [G],
      damage: 0,
      text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 damage. If 2 of them are heads, this attack does 30 damage. If all of them are heads, this attack does 60 damage.'
    },
    {
      name: 'Giga Drain',
      cost: [G, G, G],
      damage: 50,
      text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Maractus';
  public fullName: string = 'Maractus BLW 12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        if (heads === 1) {
          (effect as AttackEffect).damage = 10;
        } else if (heads === 2) {
          (effect as AttackEffect).damage = 30;
        } else if (heads === 3) {
          (effect as AttackEffect).damage = 60;
        } else {
          (effect as AttackEffect).damage = 0;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Heal after damage is dealt
      const afterDamage = new AfterDamageEffect(effect, effect.damage);
      state = store.reduceEffect(state, afterDamage);

      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect.damage, effect, store, state);
    }

    return state;
  }
}
