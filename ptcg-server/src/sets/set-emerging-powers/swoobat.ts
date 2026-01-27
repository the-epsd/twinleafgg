import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Swoobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Woobat';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [P],
      damage: 30,
      text: ''
    },
    {
      name: 'Phat Sound',
      cost: [P, C],
      damage: 0,
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Swoobat';
  public fullName: string = 'Swoobat EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });

        if (heads > 0) {
          const damage = 10 * heads;

          // Damage to active with weakness/resistance
          const dealDamage = new DealDamageEffect(effect, damage);
          dealDamage.target = opponent.active;
          store.reduceEffect(state, dealDamage);

          // Damage to bench without weakness/resistance
          opponent.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const putDamage = new PutDamageEffect(effect, damage);
              putDamage.target = bench;
              store.reduceEffect(state, putDamage);
            }
          });
        }
      });
    }
    return state;
  }
}
