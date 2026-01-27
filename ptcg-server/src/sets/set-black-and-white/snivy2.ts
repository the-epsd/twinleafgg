import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Snivy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Leaf Blade',
      cost: [G, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Snivy';
  public fullName: string = 'Snivy BLW 2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }
    return state;
  }
}
