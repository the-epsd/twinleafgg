import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Squirtle extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = W;
  public hp = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Withdraw',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Squirtle by attacks during your opponent\'s next turn.'
  },
  {
    name: 'Skull Bash',
    cost: [W, W],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name = 'Squirtle';
  public fullName = 'Squirtle MEW';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }
    return state;
  }
}
