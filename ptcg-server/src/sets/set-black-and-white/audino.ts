import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Audino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Do the Wave',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of your Benched Pokemon.'
    },
    {
      name: 'Hip Bump',
      cost: [C, C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Audino';
  public fullName: string = 'Audino BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const benchCount = player.bench.reduce((count, b) => count + (b.cards.length > 0 ? 1 : 0), 0);
      effect.damage = 20 * benchCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 30 * heads;
      });
    }
    return state;
  }
}
