import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';

export class Noivern extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Noibat';
  public cardType: CardType = N;
  public hp: number = 120;
  public weakness = [{ type: Y }];
  public retreat = [];

  public attacks = [
    {
      name: 'Boomburst',
      cost: [C],
      damage: 0,
      text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Dragon Pulse',
      cost: [P, D, C],
      damage: 120,
      text: 'Discard the top card of your deck.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '159';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Noivern';
  public fullName: string = 'Noivern UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Boomburst
    // Ref: set-unbroken-bonds/weezing.ts (Splattering Sludge)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Damage to active (uses DealDamageEffect for W/R)
      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = opponent.active;
      store.reduceEffect(state, dealDamage);

      // Damage to bench (uses PutDamageEffect, no W/R)
      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    // Attack 2: Dragon Pulse
    // Ref: set-unbroken-bonds/rhydon.ts (Dirty Work)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 1, this, effect);
    }

    return state;
  }
}
