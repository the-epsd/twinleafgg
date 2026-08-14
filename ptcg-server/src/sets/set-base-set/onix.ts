import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Onix extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = F;
  public hp = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rock Throw',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Harden',
    cost: [F, F],
    text: 'During your opponent\'s next turn, whenever 30 or less damage is done to Onix (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.)',
    damage: 0
  }];

  public set = 'BS';
  public setNumber = '56';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Onix';
  public fullName = 'Onix BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Harden
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { maxDamage: 30 });
    }

    return state;
  }
}
