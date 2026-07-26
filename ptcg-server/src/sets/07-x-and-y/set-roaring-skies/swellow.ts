import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DELTA_PLUS } from '../../../game/store/prefabs/prefabs';

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];
  public evolvesFrom = 'Taillow';

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Peck',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'ROS';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swellow';
  public fullName: string = 'Swellow ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return DELTA_PLUS(store, state, effect, this);
  }
}
