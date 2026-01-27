import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { AFTER_ATTACK, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = F;
  public hp = 50;
  public weakness = [{ type: W, value: +10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Inviting Trap',
    cost: [C],
    damage: 10,
    text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
  },
  {
    name: 'Sand Tomb',
    cost: [F],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Trapinch';
  public fullName: string = 'Trapinch SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}