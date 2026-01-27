import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Simisage extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pansage';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Seed Bomb',
      cost: [G],
      damage: 30,
      text: ''
    },
    {
      name: 'Fury Swipes',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Simisage';
  public fullName: string = 'Simisage BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 40 * heads;
      });
    }
    return state;
  }
}
