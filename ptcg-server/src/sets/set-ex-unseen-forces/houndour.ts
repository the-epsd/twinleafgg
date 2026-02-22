import { PokemonCard, Stage, CardType, SpecialCondition } from '../../game';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Houndour extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smog',
      cost: [R],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'UF';
  public name: string = 'Houndour';
  public fullName: string = 'Houndour UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
