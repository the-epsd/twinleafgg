import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Gurdurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Timburr';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Pound',
      cost: [F, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Stone Edge',
      cost: [F, F, C],
      damage: 50,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Gurdurr';
  public fullName: string = 'Gurdurr BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          (effect as AttackEffect).damage += 30;
        }
      });
    }
    return state;
  }
}
