import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
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
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Fire Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }
}
