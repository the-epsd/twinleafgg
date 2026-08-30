import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Dragonair extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dratini';
  public cardType: CardType[] = [N];
  public hp: number = 100;
  public weakness = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 30,
    text: ''
  }, {
    name: 'Dragon Tail',
    cost: [W, L],
    damage: 70,
    damageCalculator: 'x',
    text: 'Flip 2 coins. This attack does 70 damage for each heads.'
  }];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 70 * heads;
      });
    }

    return state;
  }

}
