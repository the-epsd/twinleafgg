import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Rufflet2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Peck',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Claw',
      cost: [C, C],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Rufflet';
  public fullName: string = 'Rufflet EPO 87';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          (effect as AttackEffect).damage = 0;
        }
      });
    }
    return state;
  }
}
