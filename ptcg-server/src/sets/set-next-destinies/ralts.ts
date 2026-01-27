import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Ralts extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [P],
      damage: 10,
      text: ''
    },
    {
      name: 'Smack',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
