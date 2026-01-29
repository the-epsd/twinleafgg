import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Searing Flame',
      cost: [R, C, C],
      damage: 50,
      text: 'The Defending Pokémon is now Burned.'
    },
    {
      name: 'Fire Blast',
      cost: [R, C, C, C],
      damage: 90,
      text: 'Discard a [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Moltres';
  public fullName: string = 'Moltres NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Searing Flame
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    // Fire Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }
}
