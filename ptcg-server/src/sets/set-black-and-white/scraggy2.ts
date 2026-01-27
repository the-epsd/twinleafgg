import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Scraggy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Bite',
      cost: [D, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Scraggy';
  public fullName: string = 'Scraggy BLW 69';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Both attacks are basic damage attacks with no special effects
    return state;
  }
}
