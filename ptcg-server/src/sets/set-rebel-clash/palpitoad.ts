import { State, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Palpitoad extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Twirling Sign',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public evolvesFrom: string = 'Tympole';

  public setNumber: string = '45';

  public name: string = 'Palpitoad';

  public fullName: string = 'Palpitoad RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    return state;
  }
}
