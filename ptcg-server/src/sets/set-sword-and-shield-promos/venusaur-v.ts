import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../game';
import { DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class VenusaurV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Leaf Drain',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 50,
      text: 'Heal 30 damage from this Pokémon.'
    },
    {
      name: 'Double-Edge',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 190,
      text: 'This Pokémon also does 30 damage to itself.'
    }
  ];

  public set: string = 'SWSH';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public name: string = 'Venusaur V';

  public fullName: string = 'Venusaur V SWSH 100';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damage = 30;

      const dealDamage = new DealDamageEffect(effect, damage);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}