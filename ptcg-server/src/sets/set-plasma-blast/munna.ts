import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Munna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mumble',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Focused Wish',
      cost: [P, C],
      damage: 10,
      damageCalculation: '+' as '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Munna';
  public fullName: string = 'Munna PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
