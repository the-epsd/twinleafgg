import { CardTag, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType = G;
  public hp = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Big Bite',
    cost: [G],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Mud Slap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set = 'HP';
  public setNumber = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Trapinch';
  public fullName = 'Trapinch HP';

  public readonly BIG_BITE_MARKER: string = 'BIG_BITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}