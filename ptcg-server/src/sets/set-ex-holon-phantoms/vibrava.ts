import { CardTag, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vibrava extends PokemonCard {
  public cardType = G;
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public tags = [CardTag.DELTA_SPECIES];
  public hp = 80;
  public weakness = [{ type: C }];
  public resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Knock Away',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
  },
  {
    name: 'Cutting Wind',
    cost: [G, C, C],
    damage: 40,
    text: ''
  }];

  public set = 'HP';
  public setNumber = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vibrava';
  public fullName = 'Vibrava HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}