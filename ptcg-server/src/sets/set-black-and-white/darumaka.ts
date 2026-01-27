import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Darumaka extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Firebreathing',
      cost: [R],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Darumaka';
  public fullName: string = 'Darumaka BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }
    return state;
  }
}
