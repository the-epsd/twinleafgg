import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Larvesta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Ram',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Flare',
      cost: [R, R, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Larvesta';
  public fullName: string = 'Larvesta DEX 20';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
