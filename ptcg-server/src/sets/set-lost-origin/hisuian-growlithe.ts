import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HisuianGrowlithe extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Singe',
      cost: [],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'LOR';

  public setNumber = '83';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'F';

  public name: string = 'Hisuian Growlithe';

  public fullName: string = 'Hisuian Growlithe LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Singe
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}