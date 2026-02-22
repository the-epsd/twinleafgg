import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class UmbreonV extends PokemonCard {
  public tags = [CardTag.POKEMON_V, CardTag.SINGLE_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 200;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mean Look',
    cost: [D],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon ' +
      'can\'t retreat.'
  },
  {
    name: 'Moonlight Blade',
    cost: [D, C, C],
    damage: 80,
    text: 'If this Pokémon has any damage counters on it, this attack ' +
      'does 80 more damage.'
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon V';
  public fullName: string = 'Umbreon V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const source = player.active;

      // Check if source Pokemon has damage
      const damage = source.damage;
      if (damage > 0) {
        effect.damage += 80;
      }

      return state;

    }
    return state;
  }
}