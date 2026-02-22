import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Axew';
  public cardType: CardType = C;
  public hp: number = 90;
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Dual Chop',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }
    return state;
  }
}
