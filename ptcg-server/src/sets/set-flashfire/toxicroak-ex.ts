import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ToxicroakEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 170;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Triple Poison',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Your opponent\'s Active Pokemon is now Poisoned. Put 3 damage ' +
        'counters instead of 1 on that Pokemon between turns.'
    }, {
      name: 'Smash Uppercut',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 80,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
  ];

  public set: string = 'FLF';

  public name: string = 'Toxicroak-EX';

  public fullName: string = 'Toxicroak EX FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 30;
      return store.reduceEffect(state, specialCondition);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }

}
