import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Steenee extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bounsweet';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [G],
    damage: 30,
    text: ''
  }, {
    name: 'Double Spin',
    cost: [G, G],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 40 damage for each heads.'
  }];

  public set: string = 'PAR';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Steenee';
  public fullName: string = 'Steenee PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 40 * heads;
      });
    }
    return state;
  }
}