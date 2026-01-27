import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Vullaby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ram',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Gust',
      cost: [C, C],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Vullaby';
  public fullName: string = 'Vullaby BLW';

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
