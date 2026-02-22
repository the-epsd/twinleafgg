import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pawniard2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Iron Head',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard NVI 75';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, headsCount => {
        effect.damage = 10 * headsCount;
      });
    }
    return state;
  }
}
