import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../../game/store/prefabs/prefabs';

export class Ferrothorn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ferroseed';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Spike Sting',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Kaboom Needles',
    cost: [M, M],
    damage: 0,
    text: 'This attack does 50 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) This Pokémon also does 130 damage to itself.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spike Sting
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 50);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 50);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 130);
    }

    return state;
  }
}
