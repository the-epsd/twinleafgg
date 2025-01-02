import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.LIGHTNING }];

  public attacks = [
    {
      name: 'Rain Splash',
      cost: [CardType.WATER],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark: string = 'E';
  public set: string = 'SHF';
  public name: string = 'Buizel';
  public setNumber = '22';
  public fullName: string = 'Buizel SHF';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}