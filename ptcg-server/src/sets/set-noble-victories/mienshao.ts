import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mienshao extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mienfoo';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Feint',
    cost: [C],
    damage: 30,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }, {
    name: 'High Jump Kick',
    cost: [F, F],
    damage: 50,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mienshao';
  public fullName: string = 'Mienshao NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }
    return state;
  }
}
