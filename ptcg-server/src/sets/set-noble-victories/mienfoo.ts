import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Mienfoo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'High Jump Kick',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mienfoo';
  public fullName: string = 'Mienfoo NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
