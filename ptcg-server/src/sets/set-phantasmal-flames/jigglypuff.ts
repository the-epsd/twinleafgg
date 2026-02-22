import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Jigglypuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Ball Roll',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Jigglypuff';
  public fullName: string = 'Jigglypuff M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, headsCount => {
        effect.damage = 20 * headsCount;
      });
    }

    return state;
  }
}
