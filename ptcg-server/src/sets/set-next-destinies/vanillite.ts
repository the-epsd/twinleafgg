import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Vanillite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Beat',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Icy Snow',
      cost: [W, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanillite';
  public fullName: string = 'Vanillite NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
