import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Klang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Klink';
  public cardType: CardType = M;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Vice Grip',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Gear Grind',
      cost: [M, M, C],
      damage: 80,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Klang';
  public fullName: string = 'Klang BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 80 * heads;
      });
    }
    return state;
  }
}
