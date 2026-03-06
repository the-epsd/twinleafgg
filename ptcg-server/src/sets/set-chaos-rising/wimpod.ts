import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';

export class Wimpod extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Corkscrew Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Wimpod';
  public fullName: string = 'Wimpod M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
