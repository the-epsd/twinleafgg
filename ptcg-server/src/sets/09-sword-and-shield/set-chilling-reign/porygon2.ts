import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Porygon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Porygon';
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tri-Attack',
    cost: [C, C],
    damage: 30,
    damageCalculator: 'x',
    text: 'Flip 3 coins. This attack does 30 damage for each heads.'
  }];

  public regulationMark = 'E';

  public set: string = 'CRE';
  public name: string = 'Porygon2';
  public fullName: string = 'Porygon2 CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 30 * heads;
      });
    }
    return state;
  }
}