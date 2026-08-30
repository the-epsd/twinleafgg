import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Duosion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Solosis';
  public regulationMark = 'H';
  public cardType: CardType[] = [P];
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Double Trick',
    cost: [P],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage for each heads.'
  }];

  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Duosion';
  public fullName: string = 'Duosion TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 30 * heads;
      });
    }

    return state;
  }

}
