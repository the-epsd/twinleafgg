import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  WAS_ATTACK_USED, BLOCK_RETREAT, DISCARD_ALL_ENERGY_FROM_POKEMON
} from '../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class LatiosEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 170;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Mach Flight',
      cost: [P, C],
      damage: 40,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Luster Purge',
      cost: [W, P, C],
      damage: 150,
      text: 'Discard all Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latios-EX';
  public fullName: string = 'Latios-EX PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Mach Flight - defending can't retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    // Attack 2: Luster Purge - discard all energy from self
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
