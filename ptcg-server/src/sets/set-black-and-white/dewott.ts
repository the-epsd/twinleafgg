import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Dewott extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Oshawott';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Razor Shell',
      cost: [W, W, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Dewott';
  public fullName: string = 'Dewott BLW 29';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }
    return state;
  }
}
