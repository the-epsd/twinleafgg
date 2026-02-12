import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Shelgon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bagon';
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Knock Away',
      cost: [C],
      damage: 10,
      damageCalculation: '+' as '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    },
    {
      name: 'Rollout',
      cost: [R, W, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shelgon';
  public fullName: string = 'Shelgon PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
