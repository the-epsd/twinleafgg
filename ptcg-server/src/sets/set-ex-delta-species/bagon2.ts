import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Bagon2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ember',
      cost: [R, C],
      damage: 30,
      text: 'Discard a [R] Energy card attached to Bagon.'
    },
  ];

  public set: string = 'DS';
  public name: string = 'Bagon';
  public fullName: string = 'Bagon DS 58';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }

}
