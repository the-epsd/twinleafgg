import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Archen extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Rock Throw',
    cost: [F],
    damage: 20,
    text: ''
  }, {
    name: 'Acrobatics',
    cost: [C, C],
    damage: 20,
    text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'NVI';
  public name: string = 'Archen';
  public fullName: string = 'Archen NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }

}
