import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slugma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public hp: number = 80;
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Hot Magma',
      cost: [R, C],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'TWM';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      return store.reduceEffect(state, specialCondition);
    }
    return state;
  }

}