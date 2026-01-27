import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, DRAW_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Watchog extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Patrat';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Lookout',
      cost: [C],
      damage: 0,
      text: 'Draw 3 cards.'
    },
    {
      name: 'Slam',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Watchog';
  public fullName: string = 'Watchog BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 3);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 50 * heads;
      });
    }

    return state;
  }
}
