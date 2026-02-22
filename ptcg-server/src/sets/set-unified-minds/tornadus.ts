import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tornadus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Knuckle Punch',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Thunderous Tornado',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'If Thundurus is on your Bench, this attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '178';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tornadus';
  public fullName: string = 'Tornadus UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunderous Tornado
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Check for Thundurus on your Bench
      const hasThundurus = player.bench.some(
        b => b.cards.length > 0 && b.cards[0].name.toLowerCase().includes('thundurus')
      );
      if (hasThundurus) {
        const opponent = effect.opponent;
        for (const bench of opponent.bench) {
          if (bench.cards.length > 0) {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = bench;
            store.reduceEffect(state, damageEffect);
          }
        }
      }
      return state;
    }
    return state;
  }
}
