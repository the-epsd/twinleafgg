import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Seviper extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Spit Poison',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.',
    },
    {
      name: 'Venoshock',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 120 more damage.',
    }
  ];
  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name: string = 'Seviper';

  public fullName: string = 'Seviper SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);

    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      let damage = 60;
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        damage += 120;
      }
      effect.damage = damage;
    }
    return state;
  }
}
