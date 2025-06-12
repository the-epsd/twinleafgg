import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Rising Lunge',
      cost: [R, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
    }
  ];

  public set: string = 'DS';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar DS';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }

}
