import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Krokorok extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandile';

  public cardType: CardType = D;

  public hp: number = 90;

  public weakness = [{ type: F }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Mud-Slap',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Corkscrew Punch',
      cost: [D, D, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Krokorok';

  public fullName: string = 'Krokorok DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vanilla attacks with no effects
    return state;
  }

}
