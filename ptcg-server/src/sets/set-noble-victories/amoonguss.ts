import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Amoonguss extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Foongus';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Toxic',
      cost: [G],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Poisoned Pokémon between turns.'
    },
    {
      name: 'Rising Lunge',
      cost: [G, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage and the Defending Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Amoonguss';
  public fullName: string = 'Amoonguss NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic - double poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      addSpecialCondition.poisonDamage = 20; // 2 damage counters = 20 damage
      store.reduceEffect(state, addSpecialCondition);
    }

    // Rising Lunge - flip for more damage and paralysis
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 30;
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }
}
