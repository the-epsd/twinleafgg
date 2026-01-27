import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Zorua extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ram',
      cost: [D],
      damage: 10,
      text: ''
    },
    {
      name: 'Rising Lunge',
      cost: [D, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Zorua';
  public fullName: string = 'Zorua EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }
    return state;
  }
}
