import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class BlackKyuremEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = N;
  public hp: number = 180;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [
    { name: 'Slash', cost: [C, C, C], damage: 60, text: '' },
    {
      name: 'Black Ballista',
      cost: [W, W, L, C],
      damage: 200,
      text: 'Discard 3 Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PLS';
  public name: string = 'Black Kyurem EX';
  public fullName: string = 'Black Kyurem EX PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this))
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 3);

    return state;
  }

}
