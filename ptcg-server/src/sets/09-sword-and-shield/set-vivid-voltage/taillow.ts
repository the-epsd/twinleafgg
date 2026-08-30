import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Taillow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Peck',
    cost: [C, C],
    damage: 20,
    text: 'Flip 2 coins. This attack does 20 damage for each heads.'
  }];

  public set = 'VIV';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name = 'Taillow';
  public fullName = 'Taillow VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }

}