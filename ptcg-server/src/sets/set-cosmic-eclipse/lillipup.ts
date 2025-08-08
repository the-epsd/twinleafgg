import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Lillipup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [
    {
      name: 'Baby-Doll Eyes',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.',
    },
    {
      name: 'Tackle',
      cost: [C, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'CEC';
  public name: string = 'Lillipup';
  public fullName: string = 'Lillipup CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '174';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}