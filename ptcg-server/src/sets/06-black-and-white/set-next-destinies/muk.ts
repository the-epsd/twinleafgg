import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, SpecialCondition } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Gentle Wrap',
      cost: [P, C],
      damage: 20,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Toxic Secretion',
      cost: [P, C, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Muk';
  public fullName: string = 'Muk NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gentle Wrap - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Toxic Secretion - double poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialConditionEffect.poisonDamage = 20;
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
