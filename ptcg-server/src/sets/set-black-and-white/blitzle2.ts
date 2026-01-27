import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Blitzle2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stomp',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Blitzle';
  public fullName: string = 'Blitzle BLW 41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }
    return state;
  }
}
