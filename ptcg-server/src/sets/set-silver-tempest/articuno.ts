import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DealDamageEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ice Wing',
      cost: [CardType.WATER],
      damage: 20,
      text: ''
    },
    {
      name: 'Wild Freeze',
      cost: [CardType.WATER, CardType.WATER],
      damage: 70,
      text: 'This Pokémon also does 50 damage to itself. Your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}