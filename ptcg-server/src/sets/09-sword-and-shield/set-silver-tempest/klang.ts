import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Klang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Klink';
  public regulationMark: string = 'F';
  public cardType: CardType[] = [M];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gear Grind',
    cost: [M, C, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip 2 coins. The attack does 80 damage for each heads.'
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Klang';
  public fullName: string = 'Klang SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 80 * heads;
      });

    }

    return state;
  }

}