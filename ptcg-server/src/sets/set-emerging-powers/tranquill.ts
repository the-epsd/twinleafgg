import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Tranquill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pidove';
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Claw',
      cost: [C],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
    {
      name: 'Wing Attack',
      cost: [C, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Tranquill';
  public fullName: string = 'Tranquill EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          (effect as AttackEffect).damage = 0;
        }
      });
    }
    return state;
  }
}
