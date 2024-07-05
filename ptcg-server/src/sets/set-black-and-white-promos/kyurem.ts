import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

export class Kyurem extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL, value: 2 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Outrage',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Glaciate',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'BWP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Kyurem';

  public fullName: string = 'Kyurem BWP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const damageCounters = player.active.damage;
      effect.damage += damageCounters * 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 30);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}
