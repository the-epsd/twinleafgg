import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Simisear extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pansear';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Double Fire',
    cost: [R, R, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Simisear';
  public fullName: string = 'Simisear NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 80 * heads;
      });
    }
    return state;
  }
}
