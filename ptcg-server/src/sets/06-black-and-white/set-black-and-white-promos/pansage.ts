import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

// Ref: set-twilight-masquerade/sunkern.ts
export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Bullet Seed',
    cost: [G, C],
    damage: 10,
    damageCalculation: 'x',
    text: ' Flip 4 coins. This attack does 10 damage for each heads. '
  }];

  public set: string = 'BWP';

  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Pansage BWP';
  public name: string = 'Pansage';
  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
    }

    return state;
  }
}