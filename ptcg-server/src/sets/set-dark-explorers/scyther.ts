import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Scyther extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 80;

  public weakness = [{ type: R }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Air Slash',
      cost: [C, C, C],
      damage: 60,
      text: 'Discard an Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '4';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}
