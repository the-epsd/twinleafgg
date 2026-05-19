import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

export class Sobble extends PokemonCard {
  public regulationMark = 'D';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pound',
      cost: [C],
      damage: 10,
      text: '',
    },
    {
      name: 'Water Gun',
      cost: [W, C],
      damage: 20,
      text: '',
    },
  ];

  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Sobble';
  public fullName: string = 'Sobble SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
