import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Tranquill extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidove';

  public cardType: CardType = C;

  public hp: number = 70;

  public weakness = [{
    type: CardType.LIGHTNING
  }];

  public resistance = [{
    type: CardType.FIGHTING,
    value: -20
  }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Gust', cost: [C, C], damage: 30, text: '' },
    {
      name: 'Quick Attack',
      cost: [C, C, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'BLW';

  public name: string = 'Tranquill';

  public fullName: string = 'Tranquill BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }
    return state;
  }

}
